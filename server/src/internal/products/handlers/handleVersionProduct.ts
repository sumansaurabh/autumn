import {
	type AppEnv,
	CreateProductSchema,
	type FreeTrial,
	type FullProduct,
	type Organization,
	type ProductItem,
} from "@autumn/shared";
import { FeatureService } from "@/internal/features/FeatureService.js";
import { EntitlementService } from "@/internal/products/entitlements/EntitlementService.js";
import { handleNewFreeTrial } from "@/internal/products/free-trials/freeTrialUtils.js";
import { ProductService } from "@/internal/products/ProductService.js";
import { PriceService } from "@/internal/products/prices/PriceService.js";
import { handleNewProductItems } from "@/internal/products/product-items/productItemUtils/handleNewProductItems.js";
import { validateProductItems } from "@/internal/products/product-items/validateProductItems.js";
import {
	constructProduct,
	initProductInStripe,
} from "@/internal/products/productUtils.js";
import { JobName } from "@/queue/JobName.js";
import { addTaskToQueue } from "@/queue/queueUtils.js";
import { getEntsWithFeature } from "../entitlements/entitlementUtils.js";

/**
 * Handle the version update for a product and manage associated items and entitlements.
 *
 * This function updates the product version, validates product items, and handles the insertion of new products, prices, and entitlements. It also manages free trial updates and initializes the product in Stripe. The function interacts with various services to ensure that all related data is correctly processed and stored.
 *
 * @param req - The request object containing the necessary data for processing.
 * @param res - The response object used to send the response back to the client.
 * @param latestProduct - The current product details that need to be updated.
 * @param org - The organization associated with the product.
 * @param env - The application environment in which the product operates.
 * @param items - An array of product items to be associated with the new product version.
 * @param freeTrial - The free trial information to be applied to the product.
 * @returns A promise that resolves when the product update is complete.
 */
export const handleVersionProductV2 = async ({
	req,
	res,
	latestProduct,
	org,
	env,
	items,
	freeTrial,
}: {
	req: any;
	res: any;
	latestProduct: FullProduct;
	org: Organization;
	env: AppEnv;
	items: ProductItem[];
	freeTrial: FreeTrial;
}) => {
	const { db } = req;

	const curVersion = latestProduct.version;
	const newVersion = curVersion + 1;

	const features = await FeatureService.getFromReq(req);

	console.log(
		`Updating product ${latestProduct.id} version from ${curVersion} to ${newVersion}`,
	);

	const newProduct = constructProduct({
		productData: CreateProductSchema.parse({
			...latestProduct,
			...req.body,
			version: newVersion,
		}),
		orgId: org.id,
		env: latestProduct.env as AppEnv,
		processor: latestProduct.processor,
		baseVariantId: latestProduct.base_variant_id,
	});

	// Validate product items...
	validateProductItems({
		newItems: items,
		features,
		orgId: org.id,
		env,
	});

	if (latestProduct.is_default) {
		await ProductService.updateByInternalId({
			db,
			internalId: latestProduct.internal_id,
			update: {
				is_default: false,
			},
		});
	}

	await ProductService.insert({ db, product: newProduct });

	const { customPrices, customEnts } = await handleNewProductItems({
		db,
		curPrices: latestProduct.prices,
		curEnts: latestProduct.entitlements,
		newItems: items,
		features,
		product: newProduct,
		logger: console,
		isCustom: false,
		newVersion: true,
	});

	await EntitlementService.insert({
		db,
		data: customEnts,
	});

	await PriceService.insert({
		db,
		data: customPrices,
	});

	// Handle new free trial
	if (freeTrial || latestProduct.free_trial) {
		await handleNewFreeTrial({
			db,
			newFreeTrial: freeTrial,
			curFreeTrial: latestProduct.free_trial,
			internalProductId: newProduct.internal_id,
			isCustom: false,
			newVersion: true, // This is a new product version
		});
	}

	// await addTaskToQueue({
	//   jobName: JobName.DetectBaseVariant,
	//   payload: {
	//     curProduct: {
	//       ...newProduct,
	//       // prices: customPrices,
	//       // entitlements: getEntsWithFeature({ ents: customEnts, features }),
	//     },
	//   },
	// });

	await initProductInStripe({
		db,
		product: {
			...newProduct,
			prices: customPrices,
			entitlements: getEntsWithFeature({ ents: customEnts, features }),
		} as FullProduct,
		org,
		env,
		logger: console,
	});

	await addTaskToQueue({
		jobName: JobName.RewardMigration,
		payload: {
			oldPrices: latestProduct.prices,
			productId: latestProduct.id,
			// newPrices: customPrices,
			// product: {
			// 	...newProduct,
			// 	prices: customPrices,
			// 	entitlements: getEntsWithFeature({ ents: customEnts, features }),
			// },
			orgId: org.id,
			env,
		},
	});

	res.status(200).send(newProduct);
};
