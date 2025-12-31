import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';

// 1. Roles enum (runtime-safe)
export const Role = {
    PRACTITIONER: 'practitioner',
    PATIENT: 'patient',
};

@Schema({ timestamps: true })
export class User {
    @Prop({
        type: String,
        enum: Object.values(Role),
        required: true,
        index: true,
        default: Role.PATIENT,
    })
    role;

    @Prop({ type: String, required: true })
    name;

    @Prop({ type: String, required: true, unique: true, index: true })
    email;

    @Prop({ type: String, required: true })
    mobile;

    @Prop({ type: String, required: true, select: false })
    password;

    @Prop({ type: Boolean, default: true })
    isActive;

    @Prop({ type: Date })
    lastLogin;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Password hashing hook
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
