require('dotenv').config()

interface Config {
  maintenance: boolean
  apiPort: string
  catToken: string
  platform: {
    [key: string]: PlatformConfig
  }
  database: {
    [key: string]: DatabaseConfig
  }
}

interface PlatformConfig {
  readonly token: string
  readonly signingSecret: string
}

interface DatabaseConfig {
  readonly uri: string
  readonly database: string
}

export const config: Config = {
  maintenance: process.env.MAINTENANCE === "true" || false,
  apiPort: process.env.API_PORT || "5051",
  catToken: process.env.CAT_TOKEN || "token-unknown",
  platform: {
    slack: {
      token: process.env.SLACK_TOKEN || "xoxb-unknown",
      signingSecret: process.env.SLACK_SIGNING_SECRET || "secret-unknown",
    }
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || "mongodb://localhost:27017",
      database: process.env.MONGODB_DATABASE || "db-unknown"
    }
  }
};