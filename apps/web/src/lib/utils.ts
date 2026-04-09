import { cn as sharedCn } from "@graphql-conf/ui/lib/utils";

export const cn: typeof sharedCn = (...inputs) => {
	return sharedCn(...inputs);
};
