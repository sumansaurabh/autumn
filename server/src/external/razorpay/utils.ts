import { ErrCode } from "@/errors/errCodes.js";
import { decryptData } from "@/utils/encryptUtils.js";
import RecaseError from "@/utils/errorUtils.js";
import { Organization, AppEnv } from "@autumn/shared";
import Razorpay from "razorpay";

export const createRazorpayCli = ({
	org,
	env,
}: {
	org: Organization;
	env: AppEnv;
}) => {
	let keyIdEncrypted =
		env == AppEnv.Sandbox
			? org.razorpay_config?.test_key_id
			: org.razorpay_config?.live_key_id;

	let keySecretEncrypted =
		env == AppEnv.Sandbox
			? org.razorpay_config?.test_key_secret
			: org.razorpay_config?.live_key_secret;

	if (!keyIdEncrypted || !keySecretEncrypted) {
		throw new RecaseError({
			message: `Please connect your Razorpay ${env == AppEnv.Sandbox ? "test" : "live"} key ID and secret. You can find them here: https://dashboard.razorpay.com${env == AppEnv.Sandbox ? "/test" : ""}/apikeys`,
			code: ErrCode.RazorpayConfigNotFound,
			statusCode: 400,
		});
	}

	let keyId = decryptData(keyIdEncrypted);
	let keySecret = decryptData(keySecretEncrypted);

	return new Razorpay({
		key_id: keyId,
		key_secret: keySecret,
	});
};