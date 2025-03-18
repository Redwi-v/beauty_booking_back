export interface INotification {
  type: string;
  event: string;
  object: {
    id: string;
    status: string;
    amount: { value: string; currency: string };
    income_amount: { value: string; currency: string };
    description: string;
    recipient: { account_id: string; gateway_id: string };
    payment_method: {
      type: string;
      id: string;
      saved: boolean;
      title: string;
      card: any;
    };
    captured_at: string;
    created_at: string;
    test: boolean;
    refunded_amount: { value: string; currency: string };
    paid: boolean;
    refundable: boolean;
    metadata: any;
  };
}
