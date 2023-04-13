import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';



@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>, private readonly httpAdapter: AxiosAdapter,) {
  }

  async executeSeed() {

    await this.pokemonModel.deleteMany({});
    const pokemonToInsert: { name: string, no: number }[] = [];


    const data = await this.httpAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100');

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split("/");
      const no: number = +segments[segments.length - 2];
      pokemonToInsert.push({ name, no });

    });


    this.pokemonModel.insertMany(pokemonToInsert);
    return "seed executed";
  }


}
