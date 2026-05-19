import {
  ForkKnife, ShoppingCart, Car, Airplane, FilmStrip,
  Hospital, Pill, GraduationCap, DeviceMobile, Laptop,
  TShirt, House, Lightbulb, Dog, Money,
  Gift, Barbell, Coffee, Pizza, GameController,
  Repeat, CreditCard,
  type Icon,
} from "@phosphor-icons/react";

export const ICON_MAP: Record<string, Icon> = {
  "fork-knife": ForkKnife,
  "shopping-cart": ShoppingCart,
  car: Car,
  airplane: Airplane,
  "film-strip": FilmStrip,
  hospital: Hospital,
  pill: Pill,
  "graduation-cap": GraduationCap,
  "device-mobile": DeviceMobile,
  laptop: Laptop,
  tshirt: TShirt,
  house: House,
  lightbulb: Lightbulb,
  dog: Dog,
  money: Money,
  gift: Gift,
  barbell: Barbell,
  coffee: Coffee,
  pizza: Pizza,
  "game-controller": GameController,
  repeat: Repeat,
  "credit-card": CreditCard,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIcon(name: string): Icon | undefined {
  return ICON_MAP[name];
}
