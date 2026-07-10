const devices = {
  smartphone: {
    Apple: [
      'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
      'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
      'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
      'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 Mini',
      'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 Mini',
      'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
      'iPhone SE (2022)', 'iPhone SE (2020)',
      'iPhone XS Max', 'iPhone XS', 'iPhone XR',
      'iPhone X', 'iPhone 8 Plus', 'iPhone 8', 'iPhone 7 Plus', 'iPhone 7',
    ],
    Samsung: [
      'Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25',
      'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S24 FE',
      'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S23 FE',
      'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
      'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21', 'Galaxy S21 FE',
      'Galaxy Z Fold 6', 'Galaxy Z Fold 5', 'Galaxy Z Fold 4',
      'Galaxy Z Flip 6', 'Galaxy Z Flip 5', 'Galaxy Z Flip 4',
      'Galaxy A55', 'Galaxy A54', 'Galaxy A53', 'Galaxy A52',
      'Galaxy A35', 'Galaxy A34', 'Galaxy A33',
      'Galaxy A15', 'Galaxy A14', 'Galaxy A13',
    ],
    Xiaomi: [
      'Xiaomi 14 Ultra', 'Xiaomi 14 Pro', 'Xiaomi 14',
      'Xiaomi 13 Ultra', 'Xiaomi 13 Pro', 'Xiaomi 13',
      'Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13',
      'Redmi Note 12 Pro+', 'Redmi Note 12 Pro', 'Redmi Note 12',
      'POCO X6 Pro', 'POCO X6', 'POCO X5 Pro',
      'POCO F6 Pro', 'POCO F6', 'POCO F5',
    ],
    Huawei: [
      'P60 Pro', 'P60', 'P50 Pro', 'P50',
      'P40 Pro+', 'P40 Pro', 'P40', 'P40 Lite',
      'P30 Pro', 'P30', 'P30 Lite',
      'Mate 60 Pro', 'Mate 50 Pro',
      'Nova 12', 'Nova 11', 'Nova 10',
    ],
    Google: [
      'Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9',
      'Pixel 8 Pro', 'Pixel 8', 'Pixel 8a',
      'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a',
      'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a',
    ],
    OnePlus: [
      '12', '11', '10 Pro', '10T',
      'Nord 4', 'Nord 3', 'Nord CE 3',
    ],
    Oppo: [
      'Find X7 Ultra', 'Find X7',
      'Find X6 Pro', 'Find X5 Pro',
      'Reno 12 Pro', 'Reno 12', 'Reno 11',
      'A98', 'A78', 'A58',
    ],
    Honor: [
      'Magic 6 Pro', 'Magic 6', 'Magic 5 Pro',
      '200 Pro', '200', '90',
    ],
    Nothing: [
      'Phone (2a)', 'Phone (2)', 'Phone (1)',
    ],
  },

  tablette: {
    Apple: [
      'iPad Pro 13 M4', 'iPad Pro 11 M4',
      'iPad Air 13 M2', 'iPad Air 11 M2',
      'iPad (10e gen)', 'iPad (9e gen)',
      'iPad Mini (6e gen)',
    ],
    Samsung: [
      'Galaxy Tab S10 Ultra', 'Galaxy Tab S10+', 'Galaxy Tab S10',
      'Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9', 'Galaxy Tab S9 FE',
      'Galaxy Tab A9+', 'Galaxy Tab A9', 'Galaxy Tab A8',
    ],
    Xiaomi: [
      'Pad 6S Pro', 'Pad 6', 'Pad 5',
      'Redmi Pad Pro', 'Redmi Pad SE',
    ],
    Huawei: [
      'MatePad Pro 13.2', 'MatePad Pro 11',
      'MatePad 11.5', 'MatePad SE',
    ],
    Lenovo: [
      'Tab P12 Pro', 'Tab P12', 'Tab P11 Plus',
      'Tab M11', 'Tab M10 Plus',
    ],
  },

  ordinateur: {
    Apple: [
      'MacBook Pro 16 M4 Pro', 'MacBook Pro 14 M4 Pro', 'MacBook Pro 14 M4',
      'MacBook Air 15 M3', 'MacBook Air 13 M3',
      'MacBook Pro 16 M3 Pro', 'MacBook Pro 14 M3',
      'MacBook Air 15 M2', 'MacBook Air 13 M2',
      'iMac 24 M4', 'iMac 24 M3',
      'Mac Mini M4', 'Mac Mini M2',
    ],
    HP: [
      'Spectre x360 16', 'Spectre x360 14',
      'Envy x360 15', 'Envy 17',
      'Pavilion 15', 'Pavilion 14',
      'Victus 16', 'Omen 16',
    ],
    Lenovo: [
      'ThinkPad X1 Carbon', 'ThinkPad T14', 'ThinkPad L14',
      'IdeaPad 5 Pro', 'IdeaPad 5', 'IdeaPad 3',
      'Yoga 9i', 'Yoga 7i',
      'Legion Pro 7', 'Legion 5',
    ],
    Dell: [
      'XPS 15', 'XPS 14', 'XPS 13',
      'Inspiron 16', 'Inspiron 15', 'Inspiron 14',
      'Latitude 7440', 'Latitude 5540',
      'Alienware m18', 'Alienware m16',
    ],
    Asus: [
      'ZenBook 14 OLED', 'ZenBook S 13',
      'VivoBook 16', 'VivoBook 15',
      'ROG Zephyrus G16', 'ROG Strix G16',
      'TUF Gaming A15',
    ],
    Acer: [
      'Swift 5', 'Swift 3', 'Swift Go 14',
      'Aspire 5', 'Aspire 3',
      'Nitro 5', 'Predator Helios 16',
    ],
    MSI: [
      'Prestige 16', 'Prestige 14',
      'Stealth 16', 'Raider GE78',
      'Katana 15', 'Thin GF63',
    ],
  },

  console: {
    Sony: [
      'PS5', 'PS5 Slim', 'PS5 Digital',
      'PS4 Pro', 'PS4 Slim', 'PS4',
      'PS Vita',
    ],
    Microsoft: [
      'Xbox Series X', 'Xbox Series S',
      'Xbox One X', 'Xbox One S', 'Xbox One',
    ],
    Nintendo: [
      'Switch OLED', 'Switch V2', 'Switch Lite',
      '3DS XL', '3DS', '2DS',
    ],
    Valve: [
      'Steam Deck OLED', 'Steam Deck',
    ],
  },

  trottinette: {
    Xiaomi: [
      'Electric Scooter 4 Ultra', 'Electric Scooter 4 Pro',
      'Electric Scooter 4', 'Electric Scooter 3',
      'Mi Scooter Pro 2', 'Mi Scooter Essential',
    ],
    Segway: [
      'Ninebot Max G2', 'Ninebot Max G30',
      'Ninebot F2 Pro', 'Ninebot F2',
      'Ninebot E2', 'Ninebot D38',
    ],
    Dualtron: [
      'Thunder 3', 'Thunder 2', 'Victor',
      'Eagle Pro', 'Mini Special',
    ],
    Kaabo: [
      'Mantis King GT', 'Mantis 10',
      'Wolf Warrior 11', 'Wolf King GT',
    ],
    Vsett: [
      'Vsett 11+', 'Vsett 10+', 'Vsett 9+', 'Vsett 8',
    ],
  },
};

export const getBrands = (deviceType) => {
  return Object.keys(devices[deviceType] || {});
};

export const getModels = (deviceType, brand) => {
  return devices[deviceType]?.[brand] || [];
};

export default devices;