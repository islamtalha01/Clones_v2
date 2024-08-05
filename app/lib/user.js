export default async function userDetails() {
  try {
    const storedUserCreds = localStorage.getItem("usercreds");

    return storedUserCreds;
  } catch (e) {
    throw e;
  }
}
