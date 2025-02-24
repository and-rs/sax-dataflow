import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export class SaxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const DB_USERNAME = "postgres";
    const DB_NAME = "balances";

    const vpc = new ec2.Vpc(this, "vpc-", {
      maxAzs: 2,
    });

    const rdsSecurityGroup = new ec2.SecurityGroup(this, "RdsSecurityGroup", {
      vpc,
      description: "Security group for our PostgreSQL RDS instance",
      allowAllOutbound: true,
    });

    const dbSecret = new secretsmanager.Secret(this, "DBSecret", {
      secretName: "rds-postgres-credentials",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: DB_USERNAME }),
        generateStringKey: "password",
        excludePunctuation: true,
      },
    });

    const dbInstance = new rds.DatabaseInstance(this, "db-", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17,
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [rdsSecurityGroup],
      credentials: rds.Credentials.fromSecret(dbSecret),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO,
      ),

      backupRetention: cdk.Duration.days(0),
      storageType: rds.StorageType.GP2,
      deleteAutomatedBackups: true,
      databaseName: DB_NAME,
      allocatedStorage: 20,
      publiclyAccessible: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    rdsSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(5432),
      "Allow connections from inside the VPC",
    );

    const fn = new NodejsFunction(this, "lambda-", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "handler",
      entry: "src/lambda/index.ts",
      timeout: cdk.Duration.seconds(60),

      bundling: {
        commandHooks: {
          beforeBundling() {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [`cp ${inputDir}/global-bundle.pem ${outputDir}`];
          },
          beforeInstall() {
            return [];
          },
        },
      },

      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },

      environment: {
        DB_HOST: dbInstance.dbInstanceEndpointAddress,
        DB_PORT: dbInstance.dbInstanceEndpointPort,
        DB_SECRET_ARN: dbSecret.secretArn,
        DB_NAME,
      },
    });

    dbSecret.grantRead(fn);
    dbInstance.connections.allowFrom(
      fn,
      ec2.Port.tcp(5432),
      "Allow Lambda to access PostgreSQL",
    );
  }
}
