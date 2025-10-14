import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

function createAwsFargateService() {
    const config = new pulumi.Config();

    const lb = new awsx.lb.ApplicationLoadBalancer("lb");
    const cluster = new aws.ecs.Cluster("cluster");

    const service = new awsx.ecs.FargateService("swen", {
        cluster: cluster.arn,
        assignPublicIp: true,
        taskDefinitionArgs: {
            container: {
                name: "swen-service",
                image: "nginx:latest",
                memory: 512,
                essential: true,
                portMappings: [
                    {
                        containerPort: 3000,
                        targetGroup: lb.defaultTargetGroup,
                    },
                ],
                environment: [
                    { name: "GEMINI_API_KEY", value: config.requireSecret("GEMINI_API_KEY") },
                    { name: "NEWS_API_KEY", value: config.requireSecret("NEWS_API_KEY") },
                    { name: "UNSPLASH_ACCESS_KEY", value: config.requireSecret("UNSPLASH_ACCESS_KEY") },
                    { name: "YOUTUBE_API_KEY", value: config.requireSecret("YOUTUBE_API_KEY") },
                    { name: "REDIS_DATABASE", value: config.requireSecret("REDIS_DATABASE") },
                ],
            },
        },
    });

    const url = pulumi.interpolate`http://${lb.loadBalancer.dnsName}`;
    return url;
}

// createAwsFargateService();