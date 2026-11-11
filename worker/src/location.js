const countryNames = new Intl.DisplayNames(['zh-CN'], { type: 'region' });

const chinaRegions = {
  AH: '安徽省', BJ: '北京市', CQ: '重庆市', FJ: '福建省', GD: '广东省', GS: '甘肃省', GX: '广西壮族自治区',
  GZ: '贵州省', HA: '河南省', HB: '湖北省', HE: '河北省', HI: '海南省', HK: '香港特别行政区', HL: '黑龙江省',
  HN: '湖南省', JL: '吉林省', JS: '江苏省', JX: '江西省', LN: '辽宁省', MO: '澳门特别行政区', NM: '内蒙古自治区',
  NX: '宁夏回族自治区', QH: '青海省', SC: '四川省', SD: '山东省', SH: '上海市', SN: '陕西省', SX: '山西省',
  TJ: '天津市', TW: '台湾省', XJ: '新疆维吾尔自治区', XZ: '西藏自治区', YN: '云南省', ZJ: '浙江省'
};

const chinaRegionNames = {
  anhui: '安徽省', beijing: '北京市', chongqing: '重庆市', fujian: '福建省', gansu: '甘肃省',
  guangdong: '广东省', guangxi: '广西壮族自治区', guizhou: '贵州省', hainan: '海南省',
  hebei: '河北省', heilongjiang: '黑龙江省', henan: '河南省', hubei: '湖北省', hunan: '湖南省',
  jiangsu: '江苏省', jiangxi: '江西省', jilin: '吉林省', liaoning: '辽宁省',
  neimongol: '内蒙古自治区', ningxia: '宁夏回族自治区', qinghai: '青海省',
  shaanxi: '陕西省', shandong: '山东省', shanghai: '上海市', shanxi: '山西省',
  sichuan: '四川省', tianjin: '天津市', xinjiang: '新疆维吾尔自治区',
  xizang: '西藏自治区', yunnan: '云南省', zhejiang: '浙江省'
};

const chinaCities = {
  beijing: '北京市', changsha: '长沙市', chengdu: '成都市', chongqing: '重庆市', dalian: '大连市',
  dongguan: '东莞市', foshan: '佛山市', fuzhou: '福州市', guangzhou: '广州市',
  hangzhou: '杭州市', harbin: '哈尔滨市', hefei: '合肥市', hongkong: '香港',
  jinan: '济南市', kunming: '昆明市', macau: '澳门', nanjing: '南京市',
  nanning: '南宁市', ningbo: '宁波市', qingdao: '青岛市', shanghai: '上海市',
  shenyang: '沈阳市', shenzhen: '深圳市', suzhou: '苏州市', taiyuan: '太原市',
  tianjin: '天津市', urumqi: '乌鲁木齐市', wenzhou: '温州市', wuhan: '武汉市',
  wuxi: '无锡市', xiamen: '厦门市', xian: '西安市', zhengzhou: '郑州市', zhuhai: '珠海市'
};

const cleanChinese = (value) => typeof value === 'string' && /\p{Script=Han}/u.test(value)
  ? value.replace(/[\p{Cc}\p{Cf}]/gu, '').trim().slice(0, 60) || null
  : null;

export function locationInChinese(cf) {
  const countryCode = typeof cf?.country === 'string' ? cf.country.toUpperCase() : '';
  if (!/^[A-Z]{2}$/.test(countryCode) || ['XX', 'T1'].includes(countryCode)) return null;
  const country = cleanChinese(countryNames.of(countryCode));
  if (!country) return null;

  // Cloudflare's city and region labels can be English. Keep only names that
  // can be expressed in Chinese without guessing or calling another service.
  if (countryCode !== 'CN') return country;
  const regionCode = typeof cf.regionCode === 'string' ? cf.regionCode.toUpperCase().replace(/^CN-/, '') : '';
  const regionKey = typeof cf.region === 'string' ? cf.region.toLowerCase().replace(/[^a-z]/g, '') : '';
  const region = chinaRegions[regionCode] || chinaRegionNames[regionKey] || cleanChinese(cf.region);
  const cityKey = typeof cf.city === 'string' ? cf.city.toLowerCase().replace(/[^a-z]/g, '') : '';
  const city = chinaCities[cityKey] || cleanChinese(cf.city);
  const parts = [country, region, city].filter(Boolean);
  return [...new Set(parts)].join(' · ');
}
