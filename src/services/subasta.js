const BASE_URL = 'http://localhost:3001/api/subasta';

export const finalizar = async (subastaID) => {
    const url = `${BASE_URL}/finalizarSubasta/${subastaID}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la subasta');
      }
  
      const result = await response.json();
      return result
    } catch (error) {
      console.error('Error:', error);
      return { status: false, message: 'NO_SUBS'}
    }
  };

export const crearSubasta = async (subastaID) => {
    const url = `${BASE_URL}/crearEvento`;
    const data = { subastaID };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la subasta');
      }
  
      const result = await response.json();
      return result
    } catch (error) {
      console.error('Error:', error);
    }
  };

// Función para guardar una subasta
export const guardarSubasta = async (subastaID, nombre, cantidad, phantomID) => {
  const url = `${BASE_URL}/guardarActualizarSubastaUsuario`;
  const data = { subastaID, nombre, cantidad, phantomID };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al guardar la subasta');
    }

    const result = await response.json();
    return result
  } catch (error) {
    console.error('Error:', error);
  }
};

// Función para obtener todas las subastas
export const obtenerSubastas = async (subastaID) => {
  const url = `${BASE_URL}/obtenerSubastantes/${subastaID}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Error al obtener las subastas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Función para eliminar una subasta por ID
export const eliminarSubasta = async (subastaID) => {
  const url = `${BASE_URL}/eliminarSubastantes/${subastaID}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar la subasta con ID: ${subastaID}`);
    }

    const result = await response.text();
    console.log(result); // Muestra el mensaje de éxito
  } catch (error) {
    console.error('Error:', error);
  }
};