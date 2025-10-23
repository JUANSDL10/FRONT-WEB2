// Simulación de API - En producción conectarías con tu backend real
const API_URL = 'http://localhost:3001/api'; // Cambiar por tu URL real

// Datos simulados
const mockUsers = [
  {
    _id: 'user1',
    nombre_usuario: 'juanperez',
    correo: 'juan@email.com',
    contrasenia: btoa('password123'), // NO usar en producción - usar bcrypt
    sexo: 'Masculino',
    rol: 'cliente',
    telefono: '8112345678',
    cart: 'cart1',
    juegosPublicados: [],
    comment: [],
    rating: [],
    order: []
  }
];

const mockCarts = [
  {
    _id: 'cart1',
    user: 'user1',
    items: [],
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const authService = {
  async login(email, password) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.correo === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // En producción, esto sería una comparación de hash
    if (btoa(password) !== user.contrasenia) {
      throw new Error('Contraseña incorrecta');
    }

    return user;
  },

 async register(userData) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Verificar si el usuario ya existe
  if (mockUsers.find(u => u.correo === userData.correo)) {
    throw new Error('El correo ya está registrado');
  }

  if (mockUsers.find(u => u.nombre_usuario === userData.nombre_usuario)) {
    throw new Error('El nombre de usuario ya existe');
  }

  const newUser = {
    _id: `user${mockUsers.length + 1}`,
    ...userData,
    contrasenia: btoa(userData.contrasenia),
    rol: userData.tipo_usuario || 'cliente', // Usa el tipo de usuario seleccionado
    cart: `cart${mockCarts.length + 1}`,
    juegosPublicados: [],
    comment: [],
    rating: [],
    order: []
  };

  const newCart = {
    _id: `cart${mockCarts.length + 1}`,
    user: newUser._id,
    items: [],
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockUsers.push(newUser);
  mockCarts.push(newCart);

  return newUser;
  },

  async updateProfile(userId, userData) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userIndex = mockUsers.findIndex(u => u._id === userId);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  }
};