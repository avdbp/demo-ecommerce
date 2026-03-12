require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

const saltRounds = 10;

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    const email = process.env.ADMIN_EMAIL || process.argv[2];
    const password = process.env.ADMIN_PASSWORD || process.argv[3];

    if (!email || !password) {
      console.log('\nUso: npm run create-admin -- <email> <contraseña>');
      console.log('  o define ADMIN_EMAIL y ADMIN_PASSWORD en .env\n');
      console.log('Ejemplo: npm run create-admin -- admin@tienda.com MiPass123\n');
      process.exit(1);
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      console.error('La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.');
      process.exit(1);
    }

    let user = await User.findOne({ email });

    if (user) {
      user.isAdmin = true;
      user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
      await user.save();
      console.log(`\n✓ Usuario "${email}" actualizado como administrador.`);
    } else {
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
      await User.create({
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Administrador',
        isAdmin: true,
      });
      console.log(`\n✓ Administrador creado: ${email}`);
    }

    console.log('Ya puedes iniciar sesión en /login con estas credenciales.\n');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
