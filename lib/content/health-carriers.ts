/**
 * Logos for the Salud strip under Alleanza Compare.
 * `src` is an official file in /public. Null entries stay in this list so a
 * usable file can be added without inventing a mark, and they are not rendered.
 *
 * companyFacts.carrierRelationships is still unverified. This strip does not
 * publish that sitewide claim. Availability is stated in the strip footnote.
 */
export type HealthCarrierLogo = {
  id: string;
  name: string;
  src: string | null;
  width: number;
  height: number;
  altEs: string;
  altEn: string;
};

export const healthCarrierLogos: readonly HealthCarrierLogo[] = [
  {
    id: "ambetter",
    name: "Ambetter",
    src: "/brand/carriers/ambetter.png",
    width: 80,
    height: 80,
    altEs: "Logotipo de Ambetter",
    altEn: "Ambetter logo",
  },
  {
    id: "oscar",
    name: "Oscar Health",
    src: "/brand/carriers/oscar.png",
    width: 640,
    height: 147,
    altEs: "Logotipo de Oscar Health",
    altEn: "Oscar Health logo",
  },
  {
    id: "unitedhealthcare",
    name: "UnitedHealthcare",
    src: "/brand/carriers/unitedhealthcare.svg",
    width: 564,
    height: 177,
    altEs: "Logotipo de UnitedHealthcare",
    altEn: "UnitedHealthcare logo",
  },
  {
    id: "community-health-choice",
    name: "Community Health Choice",
    // Official header file is a white wordmark. It disappears on this white strip.
    src: null,
    width: 611,
    height: 243,
    altEs: "Logotipo de Community Health Choice",
    altEn: "Community Health Choice logo",
  },
  {
    id: "molina",
    name: "Molina Healthcare",
    src: "/brand/carriers/molina.png",
    width: 960,
    height: 279,
    altEs: "Logotipo de Molina Healthcare",
    altEn: "Molina Healthcare logo",
  },
  {
    id: "unitedhealthone",
    name: "UnitedHealthOne",
    // uhone.com uses the UnitedHealthcare mark. No separate official wordmark was found.
    src: null,
    width: 1,
    height: 1,
    altEs: "Logotipo de UnitedHealthOne",
    altEn: "UnitedHealthOne logo",
  },
  {
    id: "manhattanlife",
    name: "ManhattanLife",
    src: "/brand/carriers/manhattanlife.png",
    width: 900,
    height: 380,
    altEs: "Logotipo de ManhattanLife",
    altEn: "ManhattanLife logo",
  },
  {
    id: "presidio",
    name: "Presidio Healthcare",
    src: "/brand/carriers/presidio.svg",
    width: 737,
    height: 121,
    altEs: "Logotipo de Presidio Healthcare",
    altEn: "Presidio Healthcare logo",
  },
  {
    id: "globe-life-family-heritage",
    name: "Globe Life Family Heritage Division",
    src: "/brand/carriers/globe-life-family-heritage.svg",
    width: 567,
    height: 129,
    altEs: "Logotipo de Globe Life, Family Heritage Division",
    altEn: "Globe Life Family Heritage Division logo",
  },
];

export const visibleHealthCarrierLogos = healthCarrierLogos.filter(
  (carrier): carrier is HealthCarrierLogo & { src: string } => carrier.src !== null,
);
