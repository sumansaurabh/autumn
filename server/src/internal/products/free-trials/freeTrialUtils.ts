import {
	type CreateFreeTrial,
	CreateFreeTrialSchema,
	ErrCode,
	type FreeTrial,
	FreeTrialDuration,
	type Price,
} from "@autumn/shared";
import { addDays, addMinutes, addMonths, addYears } from "date-fns";
import type { DrizzleCli } from "@/db/initDrizzle.js";
import { CusProductService } from "@/internal/customers/cusProducts/CusProductService.js";
import RecaseError from "@/utils/errorUtils.js";
import { generateId } from "@/utils/genUtils.js";
import { ProductService } from "../ProductService.js";
import { isOneOff } from "../productUtils.js";
import { FreeTrialService } from "./FreeTrialService.js";

export const validateOneOffTrial = async ({
	prices,
	freeTrial,
}: {
	prices: Price[];
	freeTrial: FreeTrial | null;
}) => {
	if (isOneOff(prices) && freeTrial) {
		throw new RecaseError({
			message: "One-off products cannot have a free trial",
			code: ErrCode.InvalidRequest,
			statusCode: 400,
		});
	}
};

export const validateAndInitFreeTrial = ({
	freeTrial,
	internalProductId,
	isCustom = false,
}: {
	freeTrial: CreateFreeTrial;
	internalProductId: string;
	isCustom?: boolean;
}): FreeTrial => {
	const freeTrialSchema = CreateFreeTrialSchema.parse(freeTrial);

	return {
		...freeTrialSchema,
		id: generateId("ft"),
		created_at: Date.now(),
		duration: freeTrial.duration || FreeTrialDuration.Day,
		internal_product_id: internalProductId,
		is_custom: isCustom,
		card_required: freeTrial.card_required ?? true,
	};
};

export const freeTrialsAreSame = ({
	ft1,
	ft2,
}: {
	ft1?: FreeTrial | CreateFreeTrial | null;
	ft2?: FreeTrial | CreateFreeTrial | null;
}) => {
	if (!ft1 && !ft2) return true;
	if (!ft1 || !ft2) return false;
	return (
		ft1.length === ft2.length &&
		ft1.unique_fingerprint === ft2.unique_fingerprint &&
		ft1.duration === ft2.duration &&
		ft1.card_required === ft2.card_required
	);
};

export const freeTrialToStripeTimestamp = ({
	freeTrial,
	now,
}: {
	freeTrial: FreeTrial | null | undefined;
	now?: number | undefined;
}) => {
	now = now || Date.now();

	if (!freeTrial) return undefined;

	const duration = freeTrial.duration || FreeTrialDuration.Day;
	const length = freeTrial.length;

	let trialEnd: Date;
	if (duration === FreeTrialDuration.Day) {
		trialEnd = addDays(new Date(now), length);
	} else if (duration === FreeTrialDuration.Month) {
		trialEnd = addMonths(new Date(now), length);
	} else if (duration === FreeTrialDuration.Year) {
		trialEnd = addYears(new Date(now), length);
	} else {
		throw new RecaseError({
			message: `Invalid free trial duration: ${duration}`,
			code: "invalid_free_trial_duration",
			statusCode: 400,
		});
	}

	// trialEnd = addMinutes(trialEnd, 5);
	trialEnd = addMinutes(trialEnd, 10);

	return Math.ceil(trialEnd.getTime() / 1000);
};

export const getFreeTrialAfterFingerprint = async ({
	db,
	freeTrial,
	productId,
	fingerprint,
	internalCustomerId,
	multipleAllowed,
}: {
	db: DrizzleCli;
	freeTrial: FreeTrial | null | undefined;
	productId: string;
	fingerprint: string | null | undefined;
	internalCustomerId: string;
	multipleAllowed: boolean;
}): Promise<FreeTrial | null> => {
	if (!freeTrial) return null;

	if (multipleAllowed) {
		return freeTrial;
	}

	let uniqueFreeTrial: FreeTrial | null = freeTrial;

	const data = await CusProductService.getByFingerprint({
		db,
		productId,
		internalCustomerId,
		fingerprint: uniqueFreeTrial.unique_fingerprint ? fingerprint! : undefined,
	});

	const exists = data && data.length > 0;

	if (exists) {
		console.log("Free trial fingerprint exists");
		uniqueFreeTrial = null;
	}

	return uniqueFreeTrial;
};

/**
 * Handles the creation or update of a free trial based on the provided parameters.
 *
 * The function first checks if the new free trial is null; if so, it deletes the current free trial if it exists and is not custom.
 * If the new free trial is the same as the current one, it returns the current free trial.
 * Otherwise, it validates and initializes the new free trial, then either inserts or upserts it based on the flags.
 * Additionally, it updates the product's default status if the card requirement changes from false to true.
 *
 * @param db - The database connection instance.
 * @param newFreeTrial - The new free trial data to be processed.
 * @param curFreeTrial - The current free trial data, if any.
 * @param internalProductId - The internal identifier for the product associated with the free trial.
 * @param isCustom - A flag indicating if the free trial is custom.
 * @param product - Optional product data.
 * @param newVersion - A flag indicating if a new product version is being created.
 * @returns The created or updated free trial object.
 */
export const handleNewFreeTrial = async ({
	db,
	newFreeTrial,
	curFreeTrial,
	internalProductId,
	isCustom = false,
	product,
	newVersion = false,
}: {
	db: DrizzleCli;
	newFreeTrial: CreateFreeTrial | null;
	curFreeTrial: FreeTrial | null | undefined;
	internalProductId: string;
	isCustom: boolean;
	product?: any;
	newVersion?: boolean; // True if creating a new product version
}) => {
	// If new free trial is null
	if (!newFreeTrial) {
		if (!isCustom && curFreeTrial) {
			await FreeTrialService.delete({
				db,
				id: curFreeTrial.id,
			});
		}
		return null;
	}

	if (freeTrialsAreSame({ ft1: curFreeTrial, ft2: newFreeTrial })) {
		return curFreeTrial;
	}

	const createdFreeTrial = validateAndInitFreeTrial({
		freeTrial: newFreeTrial,
		internalProductId,
		isCustom,
	});

	if (isCustom || newVersion) {
		await FreeTrialService.insert({
			db,
			data: createdFreeTrial,
		});
	} else {
		createdFreeTrial.id = curFreeTrial?.id || createdFreeTrial.id;

		await FreeTrialService.upsert({
			db,
			data: createdFreeTrial,
		});
	}

	// Check if card_required is changing from false to true
	if (
		curFreeTrial?.card_required === false &&
		newFreeTrial?.card_required === true
	) {
		await ProductService.updateByInternalId({
			db,
			internalId: internalProductId,
			update: {
				is_default: false,
			},
		});
	}

	return createdFreeTrial;
};
