import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Ajoute des champs createdAt et updatedAt automatiquement
export class User extends Document {
  @Prop({ required: true }) // Le champ name est obligatoire
  name: string;

  @Prop({ required: true, unique: true }) // Le champ email est obligatoire et doit être unique
  email: string;

  @Prop({ required: true, min: 0, max: 120 }) // L'âge est obligatoire, avec une plage de 0 à 120 ans
  age: number;

  @Prop({ default: 'https://via.placeholder.com/150/0000FF/808080?text=User' }) // Valeur par défaut pour photo si non fournie
  photo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
