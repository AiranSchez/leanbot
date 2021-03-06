import { InteractiveProps } from "../../actions/interactive"
import { ThanksProps } from "../../actions/thanks/thanks"
import { Logger } from "../logger/logger"

export type PlatformName = "slack" | "discord"

export abstract class Platform {
  static dictionary = {}

  static getInstance = (platformName: PlatformName): Platform => {
    const platform = Platform.dictionary[platformName]
    if (platform) return platform
    
    const errorMessage = `The ${platformName} platform is not implemented`
    Logger.onError(errorMessage)
    throw Error(errorMessage)
  }

  abstract postMessage: (channelId: string, message: string) => Promise<void>
  abstract postBlocks: (channelId: string, blocks: any[]) => Promise<void>
  abstract getMembersId: (channelId: string) => Promise<string[]>
  abstract openInteractive: (channelId: string, view: any) => Promise<void>

  abstract getThanksProps: (data: any) => ThanksProps
  abstract getInteractiveProps: (data: any) => InteractiveProps | undefined
}