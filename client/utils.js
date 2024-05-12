const os = require("os");

export function encodeToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// Function to decode a base64 string to a normal string
export function decodeFromBase64(str) {
  console.log("str", str);
  return decodeURIComponent(escape(atob(str)));
}
export function getIPv4Addresses() {
  console.log("HELLO");
  const networkInterfaces = os.networkInterfaces();
  const addresses = {};

  // Extract IPv4 addresses for Wi-Fi and Ethernet interfaces
  for (const [interfaceName, interfaceInfo] of Object.entries(
    networkInterfaces
  )) {
    if (interfaceName === "Wi-Fi" || interfaceName.startsWith("Ethernet")) {
      const ipv4Addresses = interfaceInfo.filter(
        (info) => info.family === "IPv4"
      );
      addresses[interfaceName] = ipv4Addresses.map((info) => info.address);
    }
  }

  return addresses;
}
