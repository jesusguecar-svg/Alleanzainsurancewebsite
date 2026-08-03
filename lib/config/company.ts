export type VerifiedFact<T> =
  | { verified: true; value: T; source: string }
  | { verified: false; value: null; source?: never };

export type Testimonial = {
  quote: string;
  attribution: string;
};

export type CompanyFacts = {
  agents: VerifiedFact<number>;
  clientsServed: VerifiedFact<number>;
  yearsOfExperience: VerifiedFact<number>;
  licensedStates: VerifiedFact<readonly string[]>;
  carrierRelationships: VerifiedFact<readonly string[]>;
  testimonials: VerifiedFact<readonly Testimonial[]>;
};

/**
 * Publication claims must remain unverified until a reviewer records both a
 * value and its source. UI must never infer a value from marketing copy.
 */
export const companyFacts: CompanyFacts = {
  agents: { verified: false, value: null },
  clientsServed: { verified: false, value: null },
  yearsOfExperience: { verified: false, value: null },
  licensedStates: { verified: false, value: null },
  carrierRelationships: { verified: false, value: null },
  testimonials: { verified: false, value: null },
};

