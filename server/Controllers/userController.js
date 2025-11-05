const User = require('../Models/Model_user');

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: savedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al registrar usuario',
      details: error.message
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { Correo, Contrasenia } = req.body;

    console.log('Datos recibidos para login:', { Correo, Contrasenia });
    
    // Buscar usuario por correo
    const user = await User.findOne({ Correo });
    if (!user) {
       console.log('Usuario no encontrado:', Correo);
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }

    console.log('Usuario encontrado:', user.Nombre_usuario);

    
    // Verificar contraseña (sin encriptación por ahora)
    if (user.Contrasenia !== Contrasenia) {
       console.log('Contraseña incorrecta para usuario:', user.Nombre_usuario);
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }
    
      console.log('Login exitoso para:', user.Nombre_usuario);

    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user._id,
        Nombre_usuario: user.Nombre_usuario,
        Correo: user.Correo,
        Rol: user.Rol,
        Sexo: user.Sexo,
        Telefono: user.Telefono
      }
    });
  } catch (error) {
     console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
      details: error.message
    });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Usuario no encontrado'
    });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al actualizar usuario',
      details: error.message
    });
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios',
      details: error.message
    });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      user: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar usuario',
      details: error.message
    });
  }
};

// Exportar todos los métodos
module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser
};