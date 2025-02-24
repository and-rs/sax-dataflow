#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { SaxStack } from "../lib/stack";

const app = new App();
new SaxStack(app, "sax", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
