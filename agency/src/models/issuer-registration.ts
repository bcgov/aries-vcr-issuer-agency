export interface IssuerPayload {
  name: string;
  did: string;
  email: string;
  logo_b64: string;
  abbreviation: string;
  url: string;
  abbreviations: { [key: string]: string };
  labels: { [key: string]: string };
  urls: { [key: string]: string };
}

export interface SchemaTopic {
  name: string;
  topic_type: string;
}

export interface TopicMapping {
  source_id: Mapping;
  type: Mapping;
}

interface Translation {
  label: string;
  description: string;
}

export interface SchemaAttributeTranslation {
  name: string;
  translations: Record<string, Translation>;
}

export interface AddressMetadata {
  addressee: string;
  civic_address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}

export interface CredentialMetadata {
  topic: SchemaTopic[];
  highlighted_attributes?: string[];
  credential_title?: string;
  cardinality: string[];
  date_fields: {
    effective_date: string;
    revoked_date: string;
    other_date_fields: string[];
  };
  address_fields: AddressMetadata[];
  search_fields: string[];
  labels: {
    schema: Record<string, string>;
    attributes: SchemaAttributeTranslation[];
  };
}

interface Mapping {
  input: string;
  from: string;
}

export interface ModelMapping {
  model: string;
  fields: Record<string, Mapping | undefined>;
}

export interface AttributeMapping extends ModelMapping {
  fields: {
    type: Mapping;
    value: Mapping;
    format?: Mapping;
  };
}

export interface NameMapping extends ModelMapping {
  fields: {
    type: Mapping;
    text: Mapping;
    format?: Mapping;
  };
}

export interface AddressMapping extends ModelMapping {
  fields: {
    addressee: Mapping;
    civic_address: Mapping;
    city: Mapping;
    province: Mapping;
    postal_code: Mapping;
    country: Mapping;
  };
}

export interface CredentialTypePayload {
  schema: string;
  version: string;
  credential_def_id: string;
  name: string;
  logo_b64: string;
  topic: TopicMapping[];
  labels: Record<string, string>;
  credential: {
    effective_date: Mapping;
    revoked_date: Mapping;
  };
  mapping: ModelMapping[];
  claim_labels: Record<string, Record<string, string>>;
  claim_descriptions: Record<string, Record<string, string>>;
  highlighted_attributes?: string[];
  credential_title?: string;
}

export interface IssuerRegistrationPayload {
  connection_id: string;
  issuer_registration: {
    credential_types: CredentialTypePayload[];
    issuer: IssuerPayload;
  };
}

// {
//   "connection_id": "4a0a179d-a199-4adf-926f-40afc85640b8",
//   "issuer_registration": {
//       "credential_types": [
//           {
//               "schema": "my-registration.emilianos-pizza-joint",
//               "version": "1.0.0",
//               "credential_def_id": "52Po5igEeRhtGHVs8Qmhow:3:CL:16:default",
//               "name": "my-registration.emilianos-pizza-joint",
//               "endpoint": "/emilianos-pizza-joint/my-registration",
//               "topic": [
//                   {
//                       "source_id": {
//                           "input": "corp_num",
//                           "from": "claim"
//                       },
//                       "type": {
//                           "input": "my-registration.emilianos-pizza-joint",
//                           "from": "value"
//                       }
//                   }
//               ],
//               "logo_b64": null,
//               "labels": {
//                   "en": "my-registration.emilianos-pizza-joint"
//               },
//               "endpoints": {
//                   "en": "/emilianos-pizza-joint/my-registration"
//               },
//               "credential": {
//                   "effective_date": {
//                       "input": "effective_date",
//                       "from": "claim"
//                   },
//                   "revoked_date": {
//                       "input": "expiry_date",
//                       "from": "claim"
//                   }
//               },
//               "mapping": [
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "corp_num",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "corp_num",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "registration_date",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "registration_date",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "name",
//                       "fields": {
//                           "text": {
//                               "input": "entity_name",
//                               "from": "claim"
//                           },
//                           "type": {
//                               "input": "entity_name",
//                               "from": "value"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "entity_name_effective",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "entity_name_effective",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "address",
//                       "fields": {
//                           "addressee": {
//                               "input": "addressee",
//                               "from": "claim"
//                           },
//                           "civic_address": {
//                               "input": "address_line_1",
//                               "from": "claim"
//                           },
//                           "city": {
//                               "input": "city",
//                               "from": "claim"
//                           },
//                           "province": {
//                               "input": "province",
//                               "from": "claim"
//                           },
//                           "postal_code": {
//                               "input": "postal_code",
//                               "from": "claim"
//                           },
//                           "country": {
//                               "input": "country",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "entity_status",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "entity_status",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "entity_status_effective",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "entity_status_effective",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "entity_type",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "entity_type",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "registered_jurisdiction",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "registered_jurisdiction",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "effective_date",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "effective_date",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "expiry_date",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "expiry_date",
//                               "from": "claim"
//                           }
//                       }
//                   }
//               ],
//               "claim_labels": {
//                   "corp_num": {
//                       "en": "Registration ID"
//                   },
//                   "registration_date": {
//                       "en": "Registration Date"
//                   },
//                   "entity_name": {
//                       "en": "Name"
//                   },
//                   "entity_name_effective": {
//                       "en": "Name Effective Date"
//                   },
//                   "addressee": {
//                       "en": "addressee"
//                   },
//                   "address_line_1": {
//                       "en": "address_line_1"
//                   },
//                   "city": {
//                       "en": "city"
//                   },
//                   "province": {
//                       "en": "province"
//                   },
//                   "postal_code": {
//                       "en": "postal_code"
//                   },
//                   "country": {
//                       "en": "country"
//                   },
//                   "entity_status": {
//                       "en": "Registration Status"
//                   },
//                   "entity_status_effective": {
//                       "en": "Status Effective Date"
//                   },
//                   "entity_type": {
//                       "en": "Registration Type"
//                   },
//                   "registered_jurisdiction": {
//                       "en": "Registered Jurisdiction"
//                   },
//                   "effective_date": {
//                       "en": "Credential Effective Date"
//                   },
//                   "expiry_date": {
//                       "en": "Credential Expiry Date"
//                   }
//               },
//               "claim_descriptions": {
//                   "corp_num": {
//                       "en": "Registration/Incorporation Number or Identifying Number"
//                   },
//                   "registration_date": {
//                       "en": "Date of Registration, Incorporation, Continuation or Amalgamation"
//                   },
//                   "entity_name": {
//                       "en": "The legal name of entity"
//                   },
//                   "entity_name_effective": {
//                       "en": "Date current name became effective"
//                   },
//                   "addressee": {
//                       "en": "addressee"
//                   },
//                   "address_line_1": {
//                       "en": "address_line_1"
//                   },
//                   "city": {
//                       "en": "city"
//                   },
//                   "province": {
//                       "en": "province"
//                   },
//                   "postal_code": {
//                       "en": "postal_code"
//                   },
//                   "country": {
//                       "en": "country"
//                   },
//                   "entity_status": {
//                       "en": "Status of the entity (active or historical)"
//                   },
//                   "entity_status_effective": {
//                       "en": "Date status became effective"
//                   },
//                   "entity_type": {
//                       "en": "Type of entity incorporated or registered"
//                   },
//                   "registered_jurisdiction": {
//                       "en": "The jurisdiction an entity was created in"
//                   },
//                   "effective_date": {
//                       "en": "Date Credential is effective"
//                   },
//                   "expiry_date": {
//                       "en": "Date Credential expired"
//                   }
//               }
//           },
//           {
//               "schema": "my-relationship.emilianos-pizza-joint",
//               "version": "1.0.0",
//               "credential_def_id": "52Po5igEeRhtGHVs8Qmhow:3:CL:18:default",
//               "name": "my-relationship.emilianos-pizza-joint",
//               "endpoint": "/emilianos-pizza-joint/my-relationship",
//               "topic": [
//                   {
//                       "related_source_id": {
//                           "input": "associated_corp_num",
//                           "from": "claim"
//                       },
//                       "related_type": {
//                           "input": "my-registration.emilianos-pizza-joint",
//                           "from": "value"
//                       },
//                       "source_id": {
//                           "input": "corp_num",
//                           "from": "claim"
//                       },
//                       "type": {
//                           "input": "my-registration.emilianos-pizza-joint",
//                           "from": "value"
//                       }
//                   }
//               ],
//               "logo_b64": null,
//               "labels": {
//                   "en": "my-relationship.emilianos-pizza-joint"
//               },
//               "endpoints": {
//                   "en": "/emilianos-pizza-joint/my-relationship"
//               },
//               "cardinality_fields": [
//                   "associated_corp_num"
//               ],
//               "credential": {
//                   "effective_date": {
//                       "input": "effective_date",
//                       "from": "claim"
//                   }
//               },
//               "mapping": [
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "corp_num",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "corp_num",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "associated_corp_num",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "associated_corp_num",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "associated_registration_name",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "associated_registration_name",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "relationship",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "relationship",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "relationship_description",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "relationship_description",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "relationship_status",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "relationship_status",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "relationship_status_effective",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "relationship_status_effective",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "effective_date",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "effective_date",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "expiry_date",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "expiry_date",
//                               "from": "claim"
//                           }
//                       }
//                   }
//               ],
//               "claim_labels": {
//                   "corp_num": {
//                       "en": "Registration ID"
//                   },
//                   "associated_corp_num": {
//                       "en": "Associated Registration ID"
//                   },
//                   "associated_registration_name": {
//                       "en": "Associated Registration Namwe"
//                   },
//                   "relationship": {
//                       "en": "Relationship"
//                   },
//                   "relationship_description": {
//                       "en": "Relationship Description"
//                   },
//                   "relationship_status": {
//                       "en": "Relationship Status"
//                   },
//                   "relationship_status_effective": {
//                       "en": "Relationship Status Effective"
//                   },
//                   "effective_date": {
//                       "en": "Effective Date"
//                   },
//                   "expiry_date": {
//                       "en": "Credential Expiry Date"
//                   }
//               },
//               "claim_descriptions": {
//                   "corp_num": {
//                       "en": "Unique identifer assigned to entity by registrar"
//                   },
//                   "associated_corp_num": {
//                       "en": "Registry id(s) of associated organizations/individuals"
//                   },
//                   "associated_registration_name": {
//                       "en": "Registered name of associated organizations/individuals"
//                   },
//                   "relationship": {
//                       "en": "Name of
// the relationship"}, "relationship_description": {"en": "Description of the relationship"}, "relationship_status": {"en": "Status of the relationship"}, "relationship_status_effective": {"en": "Date the relationship became/becomes effective"}, "effective_date": {"en": "Date Credential is effective"}, "expiry_date": {"en": "Date Credential expires"}}}, {"schema": "receipt.emilianos-pizza-joint", "version": "1.0.0", "credential_def_id": "52Po5igEeRhtGHVs8Qmhow: 3:CL: 20:default", "name": "receipt.emilianos-pizza-joint", "endpoint": "/emilianos-pizza-joint/receipt", "topic": [{"source_id": {"input": "corp_num", "from": "claim"}, "type": {"input": "my-registration.emilianos-pizza-joint", "from": "value"}}], "logo_b64": null, "labels": {"en": "receipt.emilianos-pizza-joint"}, "endpoints": {"en": "/emilianos-pizza-joint/receipt"}, "credential": {"effective_date": {"input": "effective_date",
// "from": "claim"
//                   }
//               },
//               "mapping": [
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "corp_num",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "corp_num",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "name",
//                       "fields": {
//                           "text": {
//                               "input": "entity_name",
//                               "from": "claim"
//                           },
//                           "type": {
//                               "input": "entity_name",
//                               "from": "value"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "permit_id",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "permit_id",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "permit_type",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "permit_type",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "permit_issued_date",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "permit_issued_date",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "permit_status",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "permit_status",
//                               "from": "claim"
//                           }
//                       }
//                   },
//                   {
//                       "model": "attribute",
//                       "fields": {
//                           "type": {
//                               "input": "effective_date",
//                               "from": "value"
//                           },
//                           "format": {
//                               "input": "datetime",
//                               "from": "value"
//                           },
//                           "value": {
//                               "input": "effective_date",
//                               "from": "claim"
//                           }
//                       }
//                   }
//               ],
//               "claim_labels": {
//                   "corp_num": {
//                       "en": "Registration ID"
//                   },
//                   "entity_name": {
//                       "en": "Name"
//                   },
//                   "permit_id": {
//                       "en": "Permit ID"
//                   },
//                   "permit_type": {
//                       "en": "Permit Type"
//                   },
//                   "permit_issued_date": {
//                       "en": "Permit Issued Date"
//                   },
//                   "permit_status": {
//                       "en": "Permit Status"
//                   },
//                   "effective_date": {
//                       "en": "Credential Effective Date"
//                   }
//               },
//               "claim_descriptions": {
//                   "corp_num": {
//                       "en": "Registration/Incorporation Number or Identifying Number"
//                   },
//                   "entity_name": {
//                       "en": "The legal name of entity"
//                   },
//                   "permit_id": {
//                       "en": "Permit Identifying Number"
//                   },
//                   "permit_type": {
//                       "en": "Status of the permit"
//                   },
//                   "permit_issued_date": {
//                       "en": "Date Permit is issued"
//                   },
//                   "permit_status": {
//                       "en": "Status of the permit"
//                   },
//                   "effective_date": {
//                       "en": "Date Credential is effective"
//                   }
//               }
//           }
//       ],
//       "issuer": {
//           "name": "Emiliano's Pizza Joint",
//           "did": "52Po5igEeRhtGHVs8Qmhow",
//           "email": "info@emilianos-pizza-joint.ca",
//           "logo_b64": null,
//           "abbreviation": "",
//           "url": "",
//           "endpoint": "",
//           "abbreviations": {
//               "en": ""
//           },
//           "labels": {
//               "en": ""
//           },
//           "urls": {
//               "en": ""
//           }
//       }
//   }
// }
