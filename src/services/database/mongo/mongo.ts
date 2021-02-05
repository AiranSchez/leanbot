import { MongoClient } from 'mongodb'
import { ThanksDto } from '../../../models/database/dtos/thanks-dto';
import { JsonData } from '../../../models/json-data';
import { Thanks } from '../../../models/database/thanks';
import { DatabaseInstance, DatabaseResponse } from '../database';
import { Logger } from '../../logger/logger';
import { Collection } from './collections';
import { config } from '../../../config';

export class MongoDB implements DatabaseInstance {
  constructor(
    private instance = new MongoClient(`mongodb://localhost:${config.mongodb.port}`, { 
      useUnifiedTopology: true,
      // auth: {
      //   user: this.data.username,
      //   password: this.data.password
      // }
    })
  ) { }

  private async on(callback: () => Promise<any>): Promise<DatabaseResponse> {
    let data: any;
    try {
      await this.connect()
      data = await callback()
    } catch(error) {
      Logger.onDBError(error)
      await this.close()
      return { ok: false, error }
    }
    await this.close()
    return { ok: true, data };
  }

  private async connect(): Promise<void> {
    if (!this.instance.isConnected()) {
      await this.instance.connect()
    }
  }
  
  private async close(): Promise<void> {
    if (this.instance.isConnected()) {
      await this.instance.close()
    }
  }

  async saveThanks(thanksList: Thanks[]): Promise<void> {
    const response = await this.on(async () => {
      const thanks = thanksList.map((thanks: Thanks) => ThanksDto.fromModel(thanks).toJson())

      if (thanks.length > 0) {
        await this.instance.db(config.mongodb.database).collection(Collection.thanks).insertMany(thanks)
      }
    });
    
    if (!response.ok) throw Error(response.error)
  }

  async getThanksFromLastWeek(): Promise<Thanks[]> {
    const response = await this.on(async () => {
      const nowTime = (new Date()).getTime()
      const oneWeekTime = 7 * 24 * 60 * 60 * 1000
      const cursor = await this.instance.db(config.mongodb.database).collection(Collection.thanks).find({
        createdAtTime: {
          $gte: nowTime - oneWeekTime,
          $lt: nowTime,
        }
      }).toArray()

      return cursor.map((thanks: JsonData): Thanks => ThanksDto.fromJson(thanks).toModel())
    })

    return response.ok ? response.data : []
  }
}