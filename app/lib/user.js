export default async function userDetails() {
  try {
    const storedUserCreds = localStorage.getItem("usercreds");

    console.log("userCreds in the dasboard", storedUserCreds);
    return storedUserCreds;
  } catch (e) {
    throw e;
  }
}
