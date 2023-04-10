import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class PokemonService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,) {
  }

  async create(createPokemonDto: CreatePokemonDto) {

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      pokemon.name = pokemon.name.toLowerCase();
      return pokemon;
    } catch (error) {

      this.handleError(error); 
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    //no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //MongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon  with id, name or no "${term}" not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {

      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleError(error); 
    }

  }

  async remove(id: string) {
    //  const pokemon = await this.findOne(id);
    //  await pokemon.deleteOne();
    //return {id} ;
    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});
    if(deletedCount === 0) throw new BadRequestException(`Pokemon with id: ${id} not found`);
    return;
  }

  private handleError(error: any) {
    if (error.code === 11000) throw new BadRequestException(`Pokemon exist in DB ${JSON.stringify(error.keyValue)}`);
    console.log(error);
    throw new InternalServerErrorException(`Can't create pokemon. Check server logs`);
  }
}
