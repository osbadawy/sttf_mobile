import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'Effra_Trial_Hair': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Hair.ttf'),
    'Effra_Trial_HairIt': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_HairIt.ttf'),
    'Effra_Trial_Th': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Th.ttf'),
    'Effra_Trial_ThIt': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_ThIt.ttf'),
    'Effra_Trial_Lt': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Lt.ttf'),
    'Effra_Trial_LtIt': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_LtIt.ttf'),
    'Effra_Trial_Rg': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Rg.ttf'),
    'Effra_Trial_It': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_It.ttf'),
    'Effra_Trial_Md': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Md.ttf'),
    'Effra_Trial_MdIt': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_MdIt.ttf'),
    'Effra_Trial_SBd': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_SBd.ttf'),
    'Effra_Trial_SBdIt': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_SBdIt.ttf'),
    'Effra_Trial_Bd': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Bd.ttf'),
    'Effra_Trial_BdIt': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_BdIt.ttf'),
    'Effra_Trial_XBd': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_XBd.ttf'),
    'Effra_Trial_XBdIt': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_XBdIt.ttf'),
    'Effra_Trial_Blk': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Blk.ttf'),
    'Effra_Trial_BlkIt': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_BlkIt.ttf'),
    'EffraVF_Trial_Wght': require('../assets/fonts/effra-trial-cufonfonts/EffraVF_Trial_Wght.ttf'),
    'EffraVF_Trial_WghtItal': require('../assets/fonts/effra-trial-cufonfonts/EffraVF_Trial_WghtItal.ttf'),
  });
};

export const fontConfig = {
  Effra: {
    hair: 'Effra_Trial_Hair',
    hairItalic: 'Effra_Trial_HairIt',
    thin: 'Effra_Trial_Th',
    thinItalic: 'Effra_Trial_ThIt',
    light: 'Effra_Trial_Lt',
    lightItalic: 'Effra_Trial_LtIt',
    normal: 'Effra_Trial_Rg',
    normalItalic: 'Effra_Trial_It',
    medium: 'Effra_Trial_Md',
    mediumItalic: 'Effra_Trial_MdIt',
    semiBold: 'Effra_Trial_SBd',
    semiBoldItalic: 'Effra_Trial_SBdIt',
    bold: 'Effra_Trial_Bd',
    boldItalic: 'Effra_Trial_BdIt',
    extraBold: 'Effra_Trial_XBd',
    extraBoldItalic: 'Effra_Trial_XBdIt',
    black: 'Effra_Trial_Blk',
    blackItalic: 'Effra_Trial_BlkIt',
    variable: 'EffraVF_Trial_Wght',
    variableItalic: 'EffraVF_Trial_WghtItal',
  },
};
