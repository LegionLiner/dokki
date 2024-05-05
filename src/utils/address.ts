import type { Address } from "@/services/types";

interface MappedAddress {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string | null;
}

const mapAddress = (address: Address): MappedAddress => ({
  1: address.country,
  2: address.city,
  3: address.street,
  4: address.house,
  5: address.postCode,
  6: address.state,
});

export const populateAddressFormat = (
  format: string,
  address: Address,
): string => {
  const mapped = mapAddress(address);
  const regexp = /([1-6])/g;

  return format.replace(
    regexp,
    (_, p1: keyof MappedAddress) => mapped[p1] ?? `${p1}`,
  );
};
