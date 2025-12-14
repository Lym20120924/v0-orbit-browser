export interface DevicePreset {
  id: string
  name: string
  width: number
  height: number
  type: "mobile" | "tablet" | "desktop"
  userAgent?: string
}

export const devicePresets: DevicePreset[] = [
  // Mobile Devices
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    width: 393,
    height: 852,
    type: "mobile",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    width: 430,
    height: 932,
    type: "mobile",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "iphone-se",
    name: "iPhone SE",
    width: 375,
    height: 667,
    type: "mobile",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "pixel-8",
    name: "Google Pixel 8",
    width: 412,
    height: 915,
    type: "mobile",
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36",
  },
  {
    id: "samsung-s24",
    name: "Samsung Galaxy S24",
    width: 360,
    height: 780,
    type: "mobile",
    userAgent: "Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36",
  },
  {
    id: "samsung-fold",
    name: "Samsung Galaxy Fold",
    width: 280,
    height: 653,
    type: "mobile",
    userAgent: "Mozilla/5.0 (Linux; Android 14; SM-F946B) AppleWebKit/537.36",
  },
  // Tablet Devices
  {
    id: "ipad-pro-12",
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    type: "tablet",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "ipad-pro-11",
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    type: "tablet",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    width: 820,
    height: 1180,
    type: "tablet",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "ipad-mini",
    name: "iPad Mini",
    width: 768,
    height: 1024,
    type: "tablet",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "galaxy-tab-s9",
    name: "Galaxy Tab S9",
    width: 800,
    height: 1280,
    type: "tablet",
    userAgent: "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36",
  },
  // Desktop
  {
    id: "desktop-1080p",
    name: "Desktop 1080p",
    width: 1920,
    height: 1080,
    type: "desktop",
  },
  {
    id: "desktop-1440p",
    name: "Desktop 1440p",
    width: 2560,
    height: 1440,
    type: "desktop",
  },
  {
    id: "laptop-15",
    name: 'Laptop 15"',
    width: 1440,
    height: 900,
    type: "desktop",
  },
  {
    id: "laptop-13",
    name: 'Laptop 13"',
    width: 1280,
    height: 800,
    type: "desktop",
  },
  {
    id: "responsive",
    name: "Responsive",
    width: 0, // 0 means full width
    height: 0,
    type: "desktop",
  },
]

export function getDevicesByType(type: "mobile" | "tablet" | "desktop") {
  return devicePresets.filter((d) => d.type === type)
}
