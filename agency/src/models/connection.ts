/**
 * Example:
 * {
 * "connection_id": "5db4654c-9918-4d34-a656-427b6b6b271d",
 * "invitation": {
 *   "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation",
 *   "@id": "9ac0fb16-f946-44cf-b813-a44e4910695c",
 *   "recipientKeys": [
 *     "7Q5UAVJNHAphaQLeQzaBUZsGesYwyj69GSoA5KmJh4dD"
 *   ],
 *   "serviceEndpoint": "http://192.168.65.3:8021",
 *   "label": "issuer-kit-demo"
 * },
 * "invitation_url": "http://192.168.65.3:8021?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiOWFjMGZiMTYtZjk0Ni00NGNmLWI4MTMtYTQ0ZTQ5MTA2OTVjIiwgInJlY2lwaWVudEtleXMiOiBbIjdRNVVBVkpOSEFwaGFRTGVRemFCVVpzR2VzWXd5ajY5R1NvQTVLbUpoNGREIl0sICJzZXJ2aWNlRW5kcG9pbnQiOiAiaHR0cDovLzE5Mi4xNjguNjUuMzo4MDIxIiwgImxhYmVsIjogImlzc3Vlci1raXQtZGVtbyJ9",
 * "alias": "my_alias"
 * }
 */
export interface AriesInvitation {
  connection_id: string;
  invitation: {
    '@type': string;
    '@id': string;
    recipientKeys: string[];
    serviceEndpoint: string;
    label: string;
  };
  invitation_url: string;
  alias?: string;
}

/**
 * Example
 * {
 *  "invitation_msg_id": "c717c66a-8643-46cb-af79-595ec1ec452f",
 *  "state": "request",
 *  "created_at": "2021-05-04 21:31:02.429948Z",
 *  "their_public_did": "wRYyL8WjnVyrHEcpWdpSg",
 *  "routing_state": "none",
 *  "invitation_mode": "once",
 *  "connection_id": "f31fc95a-d1c7-45ef-b17b-98c3f3ab5e55",
 *  "alias": "oob-endorser",
 *  "updated_at": "2021-05-04 21:31:02.637254Z",
 *  "accept": "auto",
 *  "my_did": "AQtpAVZEbkQmdUCFz52Zak",
 *  "rfc23_state": "request-sent",
 *  "their_label": "oob-endorser",
 *  "their_role": "inviter",
 *  "request_id": "a1544ef5-45a9-4098-a23f-202131cf7f40"
}
 */
export interface ConnectionServiceResponse {
  connection_id: string;
  their_public_did: string | undefined;
  state: string;
}
