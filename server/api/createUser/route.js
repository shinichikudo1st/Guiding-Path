export const POST = async (request) => {
  try {
    const { email, password } = await request.json();
  } catch (error) {
    console.log(error);
  }
};
