export type UserOp = {
  sender: string;
  nonce: {
    type: string;
    hex: string;
  };
  initCode: string;
  callData: string;
  callGasLimit: {
    type: string;
    hex: string;
  };
  verificationGasLimit: {
    type: string;
    hex: string;
  };
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  preVerificationGas: {
    type: string;
    hex: string;
  };
  signature: string;
};

export type FetchPrice = {
  chainId: string;
  userOp: UserOp;
};
