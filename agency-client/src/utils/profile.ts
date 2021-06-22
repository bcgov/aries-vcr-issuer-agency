import { IssuerProfile } from '@/store/modules/app';

export const processProfile = (profile: IssuerProfile): IssuerProfile => {
  if (profile?.name && profile?.abbreviation && profile?.email) {
    profile.complete = true;
  }
  return profile;
};
