import { Variant, Product, Spec, OrderWorksheet, Order } from "ordercloud-javascript-sdk";
import { LineItemXp, SubscriptionXp, VariantXp } from "./xp";

export type baseOrderCloud = {
    Route: string;
    Verb: "PATCH" | "POST" | "DELETE" | "PUT" | "POST";
    Date: string
    LogID: string,
    UserToken: string;
    ConfigData: []
};

export type webhookSpendingAccountAssigned =  baseOrderCloud & {
    RouteParams: {
        buyerID?: string | null;
    };
    Request: {
        Body: {
            SpendingAccountID   : string;
            UserID              : string;            
        };
    };
}

export type webhookSpendingAccountCreated = baseOrderCloud & {
    RouteParams: {
        buyerID?: string | null;
    };
    Request: {
        Body: {
            Name   : string;
            Balance: number;
            AllowAsPaymentMethod: boolean;
            StartDate: string;
            EndDate: string;
        };
    };
    Response: {
        Body: {
            ID: string;
            Name   : string;
            Balance: number;
            AllowAsPaymentMethod: boolean;
            StartDate: string;
            EndDate: string;
        };
    };   
}

export interface IntegrationRequest {
    Environment: string;
    OrderCloudAccessToken: string;
    OrderWorksheet: OrderWorksheet;
    ErrorCode: string;
  }
  
  export interface OrderRequest {
    Response: {
        Body: Order
    }
  }
