import { HttpContextToken } from "@angular/common/http";

export const SHOW_LOADER = new HttpContextToken<boolean>(() => false);
export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);
