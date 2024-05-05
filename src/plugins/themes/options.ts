type DefaultsInstance =
  | undefined
  | {
      [key: string]: undefined | Record<string, unknown>;
      global?: Record<string, unknown>;
    };
type DefaultsOptions = Partial<DefaultsInstance>;
type Variant = NonNullable<
  "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain"
>;

const fieldVariant: Variant = "outlined";

const aliases: Record<string, any> = {};

const defaults: DefaultsOptions = {
  VTextField: {
    variant: fieldVariant,
  },
  VTextarea: {
    variant: fieldVariant,
    shaped: true,
  },
  VBtn: {
    class: "text-none",
  },
  VFileInput: {
    variant: fieldVariant,
  },
  VListItem: {
    color: "rgb(41, 128, 185)",
  },
  VPagination: {
    totalVisible: 4,
    class: "text-16",
    rounded: "md",
    color: "primary",
    size: 42,
  },
};

export { defaults, aliases };
