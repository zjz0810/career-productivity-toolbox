(() => {
  'use strict';
  const STORAGE_KEY = 'campus-job-organizer-v1';
  const FILTER_STORAGE_KEY = 'campus-job-organizer-filters-v1';
  const STATUSES = ['待筛选','准备投','已投递','已测评','笔试','面试','淘汰','Offer','不投'];
  const LINK_STATUSES = ['待解析','已解析','需人工打开'];
  const PENDING_HUNDSUN_KEY = 'campus-job-pending-hundsun-v1';
  const PENDING_AMPACE_KEY = 'campus-job-pending-ampace-v1';
  const PENDING_SHENGTONG_KEY = 'campus-job-pending-shengtong-v1';
  const PENDING_OBSBOT_KEY = 'campus-job-pending-obsbot-v1';
  const PENDING_HYTERA_KEY = 'campus-job-pending-hytera-v1';
  const PENDING_QUNHE_KEY = 'campus-job-pending-qunhe-v1';
  const PENDING_SMARTSENS_KEY = 'campus-job-pending-smartsens-v1';
  const PENDING_KTC_KEY = 'campus-job-pending-ktc-v1';
  const PENDING_WOAN_KEY = 'campus-job-pending-woan-v1';
  const PENDING_ENVISION_KEY = 'campus-job-pending-envision-v1';
  const PENDING_ENVISION_UPDATE_KEY = 'campus-job-pending-envision-update-v1';
  const PENDING_CHT_GROUP_KEY = 'campus-job-pending-cht-group-v1';
  const PENDING_CRRCTANGSHAN_KEY = 'campus-job-pending-crrc-tangshan-v1';
  const PENDING_BOE_KEY = 'campus-job-pending-boe-v1';
  const PENDING_CSCEC8B_NEW_BUILD_KEY = 'campus-job-pending-cscec8b-new-build-v1';
  const PENDING_LEADVISION_KEY = 'campus-job-pending-leadvision-v1';
  const PENDING_SAIC_KEY = 'campus-job-pending-saic-v1';
  const PENDING_CHANGCHUAN_KEY = 'campus-job-pending-changchuan-v1';
  const PENDING_GBITS_KEY = 'campus-job-pending-gbits-v1';
  const PENDING_HOLLYLAND_KEY = 'campus-job-pending-hollyland-v1';
  const PENDING_MIDEA_KEY = 'campus-job-pending-midea-v1';
  const PENDING_ZURU_KEY = 'campus-job-pending-zuru-v1';
  const PENDING_NEUEHCT_KEY = 'campus-job-pending-neuehct-v1';
  const PENDING_HUAYOU_KEY = 'campus-job-pending-huayou-v1';
  const PENDING_QDZH_KEY = 'campus-job-pending-qdzh-v1';
  const PENDING_SCC_KEY = 'campus-job-pending-scc-v1';
  const PENDING_CSCEC3B_INNOVATION_KEY = 'campus-job-pending-cscec3b-innovation-v1';
  const PENDING_FUTECH_KEY = 'campus-job-pending-futech-v1';
  const PENDING_SEPT9_FAIRS_KEY = 'campus-job-pending-sept9-fairs-v1';
  const PENDING_GREE_KEY = 'campus-job-pending-gree-v1';
  const PENDING_GREE_UPDATE_KEY = 'campus-job-pending-gree-update-v1';
  const PENDING_CNKI_KEY = 'campus-job-pending-cnki-v1';
  const PENDING_SF_AUTO_UPDATE_KEY = 'campus-job-pending-sf-auto-update-v1';
  const PENDING_SEPT15_FAIRS_KEY = 'campus-job-pending-sept15-fairs-v1';
  const PENDING_SPACE_T1_KEY = 'campus-job-pending-space-t1-v1';
  const PENDING_EASPRING_KEY = 'campus-job-pending-easpring-v1';
  const PENDING_CNNC_ZHONGYUAN_KEY = 'campus-job-pending-cnnc-zhongyuan-v1';
  const PENDING_37_INTERVIEW_KEY = 'campus-job-pending-37-interview-v1';
  const PENDING_HOYMILE_UPDATE_KEY = 'campus-job-pending-hoymile-update-v1';
  const PENDING_GEELY_KEY = 'campus-job-pending-geely-v1';
  const PENDING_PINGAN_PENSION_KEY = 'campus-job-pending-pingan-pension-v1';
  const PENDING_PINGAN_BANK_KEY = 'campus-job-pending-pingan-bank-v1';
  const PENDING_CRRC_GROUP_KEY = 'campus-job-pending-crrc-group-v1';
  const PENDING_HAIYI_SOFTWARE_KEY = 'campus-job-pending-haiyi-software-v1';
  const PENDING_FOTILE_KEY = 'campus-job-pending-fotile-v1';
  const PENDING_HONGGONG_KEY = 'campus-job-pending-honggong-v1';
  const PENDING_GOODWE_KEY = 'campus-job-pending-goodwe-v1';
  const PENDING_SEPT16_FAIRS_KEY = 'campus-job-pending-sept16-fairs-v1';
  const PENDING_SHANGHAI_POWER_INSTALL_KEY = 'campus-job-pending-shanghai-power-install-v1';
  const PENDING_JATEN_KEY = 'campus-job-pending-jaten-v1';
  const PENDING_SUNSHINE_INSURANCE_KEY = 'campus-job-pending-sunshine-insurance-v1';
  const PENDING_TOUTIAO_KEY = 'campus-job-pending-toutiao-v1';
  const PENDING_SERES_UPDATE_KEY = 'campus-job-pending-seres-update-v1';
  const PENDING_JIACHEN_UPDATE_KEY = 'campus-job-pending-jiachen-update-v1';
  const PENDING_XINHECHENG_UPDATE_KEY = 'campus-job-pending-xinhecheng-update-v1';
  const PENDING_SUZHOU_DAY_KEY = 'campus-job-pending-suzhou-day-v1';
  const PENDING_AAC_KEY = 'campus-job-pending-aac-v1';
  const PENDING_SINEXCEL_KEY = 'campus-job-pending-sinexcel-v1';
  const PENDING_HKACO_KEY = 'campus-job-pending-hkaco-v1';
  const PENDING_BLUEINTERACTIVE_KEY = 'campus-job-pending-blueinteractive-v1';
  const PENDING_STREAMAX_KEY = 'campus-job-pending-streamax-v1';
  const PENDING_TINCI_KEY = 'campus-job-pending-tinci-v1';
  const PENDING_SF_AUTO_KEY = 'campus-job-pending-sf-auto-v1';
  const PENDING_GUANGMING_TALENT_KEY = 'campus-job-pending-guangming-talent-v1';
  const PENDING_SEPT10_EVENTS_KEY = 'campus-job-pending-sept10-events-v1';
  const PENDING_HONGWANG_KEY = 'campus-job-pending-hongwang-v1';
  const PENDING_SMARTLOGIC_KEY = 'campus-job-pending-smartlogic-v1';
  const PENDING_UNIVERSITY_RECRUITMENT_KEY = 'campus-job-pending-university-recruitment-v1';
  const PENDING_TORRAS_KEY = 'campus-job-pending-torras-v1';
  const PENDING_TAUREN_KEY = 'campus-job-pending-tauren-v1';
  const PENDING_PINGAN_LIFE_KEY = 'campus-job-pending-pingan-life-v1';
  const PENDING_NOVOSNS_KEY = 'campus-job-pending-novosns-v1';
  const PENDING_SMIC_KEY = 'campus-job-pending-smic-v1';
  const PENDING_UISEE_KEY = 'campus-job-pending-uisee-v1';
  const PENDING_QUNAR_UPDATE_KEY = 'campus-job-pending-qunar-update-v1';
  const PENDING_HUOLALA_KEY = 'campus-job-pending-huolala-v1';
  const PENDING_CHANGSHA_MINING_KEY = 'campus-job-pending-changsha-mining-v1';
  const PENDING_SANKE_TREE_KEY = 'campus-job-pending-sanke-tree-v1';
  const PENDING_LIYANG_KEY = 'campus-job-pending-liyang-v1';
  const PENDING_LIYANG_FAIR_KEY = 'campus-job-pending-liyang-fair-v1';
  const PENDING_IOPT_FAIR_KEY = 'campus-job-pending-iopt-fair-v1';
  const PENDING_SUZHOU_FAIR_KEY = 'campus-job-pending-suzhou-fair-v1';
  const PENDING_SEPT14_FAIRS_KEY = 'campus-job-pending-sept14-fairs-v1';
  const PENDING_MAMMOTION_UPDATE_KEY = 'campus-job-pending-mammotion-update-v1';
  const PENDING_LENOVO_KEY = 'campus-job-pending-lenovo-v1';
  const PENDING_XIAOHONGSHU_KEY = 'campus-job-pending-xiaohongshu-v1';
  const PENDING_ECOFLOW_KEY = 'campus-job-pending-ecoflow-v1';
  const PENDING_TUHU_UPDATE_KEY = 'campus-job-pending-tuhu-update-v1';
  const PENDING_CSCEC_INTERNATIONAL_KEY = 'campus-job-pending-cscec-international-v1';
  const PENDING_SUGON_KEY = 'campus-job-pending-sugon-v1';
  const PENDING_KEHUA_DATA_KEY = 'campus-job-pending-kehua-data-v1';
  const PENDING_INTCO_UPDATE_KEY = 'campus-job-pending-intco-update-v1';
  const PENDING_INTCO_POSTER_KEY = 'campus-job-pending-intco-poster-v1';
  const PENDING_SANY_KEY = 'campus-job-pending-sany-v1';
  const PENDING_SHANGHAI_HUALI_KEY = 'campus-job-pending-shanghai-huali-v1';
  const PENDING_NEW_ORIENTAL_KEY = 'campus-job-pending-new-oriental-v1';
  const PENDING_TAVERN_KEY = 'campus-job-pending-tavern-v1';
  const PENDING_LUSTER_KEY = 'campus-job-pending-luster-v1';
  const PENDING_CCTC_KEY = 'campus-job-pending-cctc-v1';
  const PENDING_HELLOTECH_KEY = 'campus-job-pending-hellotech-v1';
  const PENDING_HELLOTECH_UPDATE_KEY = 'campus-job-pending-hellotech-update-v1';
  const PENDING_HELLOTECH_RECOMMEND_UPDATE_KEY = 'campus-job-pending-hellotech-recommend-update-v1';
  const PENDING_CF_MOTO_KEY = 'campus-job-pending-cfmoto-v1';
  const PENDING_LEAPMOTOR_KEY = 'campus-job-pending-leapmotor-v1';
  const PENDING_VISIONOX_KEY = 'campus-job-pending-visionox-v1';
  const PENDING_ANKER_KEY = 'campus-job-pending-anker-v1';
  const PENDING_QYXDL_KEY = 'campus-job-pending-qyxdl-v1';
  const PENDING_METAX_KEY = 'campus-job-pending-metax-v1';
  const PENDING_SUNWODA_KEY = 'campus-job-pending-sunwoda-v1';
  const PENDING_REO_KEY = 'campus-job-pending-reo-v1';
  const PENDING_CAINIAO_KEY = 'campus-job-pending-cainiao-v1';
  const PENDING_FANDOW_KEY = 'campus-job-pending-fandow-v1';
  const PENDING_HIKVISION_KEY = 'campus-job-pending-hikvision-v1';
  const PENDING_UBTECH_KEY = 'campus-job-pending-ubtech-v1';
  const PENDING_TPLINK_GLOBAL_KEY = 'campus-job-pending-tplink-global-v1';
  const PENDING_TPLINK_CN_KEY = 'campus-job-pending-tplink-cn-v1';
  const PENDING_MOONTON_KEY = 'campus-job-pending-moonton-v1';
  const PENDING_CVTE_KEY = 'campus-job-pending-cvte-v1';
  const PENDING_SZKINGDOM_KEY = 'campus-job-pending-szkingdom-v1';
  const PENDING_HOYMILE_KEY = 'campus-job-pending-hoymile-v1';
  const PENDING_REO_UPDATE_KEY = 'campus-job-pending-reo-update-v1';
  const PENDING_CHANGYOU_KEY = 'campus-job-pending-changyou-v1';
  const PENDING_QUNAR_KEY = 'campus-job-pending-qunar-v1';
  const PENDING_TAISTING_KEY = 'campus-job-pending-taisting-v1';
  const PENDING_DF_WESTON_KEY = 'campus-job-pending-df-weston-v1';
  const PENDING_3IROBOTICS_KEY = 'campus-job-pending-3irobotics-v1';
  const PENDING_AMEC_KEY = 'campus-job-pending-amec-v1';
  const PENDING_LIULIAN_KEY = 'campus-job-pending-liulian-v1';
  const PENDING_HISENSE_IM_KEY = 'campus-job-pending-hisense-im-v1';
  const PENDING_HISENSE_POSTER_KEY = 'campus-job-pending-hisense-poster-v1';
  const PENDING_HORIZON_KEY = 'campus-job-pending-horizon-v1';
  const PENDING_HORIZON_AUTUMN_UPDATE_KEY = 'campus-job-pending-horizon-autumn-update-v1';
  const PENDING_EMDOOR_KEY = 'campus-job-pending-emdoor-v1';
  const PENDING_KELONG_KEY = 'campus-job-pending-kelong-v1';
  const PENDING_SPEECH_KEY = 'campus-job-pending-speech-v1';
  const PENDING_CETC55_KEY = 'campus-job-pending-cetc55-v1';
  const PENDING_ZHUOYU_KEY = 'campus-job-pending-zhuoyu-v1';
  const PENDING_BOKE_KEY = 'campus-job-pending-boke-v1';
  const PENDING_HANGTIAN_DADAO_KEY = 'campus-job-pending-hangtian-dadao-v1';
  const PENDING_MANBANG_KEY = 'campus-job-pending-manbang-v1';
  const PENDING_HUAWEI_WIRELESS_KEY = 'campus-job-pending-huawei-wireless-v1';
  const PENDING_GITI_KEY = 'campus-job-pending-giti-v1';
  const PENDING_WANNENG_KEY = 'campus-job-pending-wanneng-v1';
  const PENDING_GEEKPLUS_KEY = 'campus-job-pending-geekplus-v1';
  const PENDING_RONGZHI_KEY = 'campus-job-pending-rongzhi-v1';
  const PENDING_RONGZHI_UPDATE_KEY = 'campus-job-pending-rongzhi-update-v1';
  const PENDING_DESCENTE_KEY = 'campus-job-pending-descente-v1';
  const PENDING_3IROBOTICS_UPDATE_KEY = 'campus-job-pending-3irobotics-update-v1';
  const PENDING_CHIPSEA_KEY = 'campus-job-pending-chipsea-v1';
  const PENDING_JEE_KEY = 'campus-job-pending-jee-v1';
  const PENDING_NINEBOT_KEY = 'campus-job-pending-ninebot-v1';
  const PENDING_UNILUMIN_KEY = 'campus-job-pending-unilumin-v1';
  const PENDING_CASC_KEY = 'campus-job-pending-casc-v1';
  const PENDING_CMB_KEY = 'campus-job-pending-cmb-v1';
  const PENDING_LEIHU_KEY = 'campus-job-pending-leihu-v1';
  const PENDING_XUZHIYUAN_KEY = 'campus-job-pending-xuzhiyuan-v1';
  const PENDING_CITIC_KEY = 'campus-job-pending-citic-v1';
  const PENDING_ZTE_KEY = 'campus-job-pending-zte-v1';
  const PENDING_YONGZHUO_KEY = 'campus-job-pending-yongzhuo-v1';
  const PENDING_NORTHERN_IC_KEY = 'campus-job-pending-northern-ic-v1';
  const PENDING_BJ_SPACE_TEST_KEY = 'campus-job-pending-bj-space-test-v1';
  const PENDING_SGMW_KEY = 'campus-job-pending-sgmw-v1';
  const PENDING_CISDI_KEY = 'campus-job-pending-cisdi-v1';
  const PENDING_CISDI_UPDATE_KEY = 'campus-job-pending-cisdi-update-v1';
  const PENDING_ZTSTEEL_KEY = 'campus-job-pending-ztsteel-v1';
  const PENDING_YADEA_KEY = 'campus-job-pending-yadea-v1';
  const PENDING_SPRING_AIRLINES_KEY = 'campus-job-pending-spring-airlines-v1';
  const PENDING_CATERPILLAR_KEY = 'campus-job-pending-caterpillar-v1';
  const PENDING_TBEA_KEY = 'campus-job-pending-tbea-v1';
  const PENDING_YUTONG_KEY = 'campus-job-pending-yutong-v1';
  const PENDING_SMARTMORE_KEY = 'campus-job-pending-smartmore-v1';
  const PENDING_KNIGHT_GROUP_KEY = 'campus-job-pending-knight-group-v1';
  const PENDING_IMOU_KEY = 'campus-job-pending-imou-v1';
  const PENDING_MULTIFIELDS_KEY = 'campus-job-pending-multifields-v1';
  const PENDING_TAIKANG_KEY = 'campus-job-pending-taikang-v1';
  const PENDING_TRANSSION_KEY = 'campus-job-pending-transsion-v1';
  const PENDING_SPDB_CHANGSHA_KEY = 'campus-job-pending-spdb-changsha-v1';
  const PENDING_BLUEFOCUS_KEY = 'campus-job-pending-bluefocus-v1';
  const PENDING_YAO_PIN_KEY = 'campus-job-pending-yaopin-v1';
  const PENDING_DATA_INSTITUTE_KEY = 'campus-job-pending-data-institute-v1';
  const PENDING_CCSCEC4_INSTALL_KEY = 'campus-job-pending-cscec4-install-v1';
  const PENDING_HONOR_BEIKE_KEY = 'campus-job-pending-honor-beike-v1';
  const PENDING_KINGSOFT_GAME_KEY = 'campus-job-pending-kingsoft-game-v1';
  const PENDING_FOTON_RI_KEY = 'campus-job-pending-foton-ri-v1';
  const PENDING_QXGY_WECHAT_KEY = 'campus-job-pending-qxgy-wechat-v1';
  const PENDING_XCMG_KEY = 'campus-job-pending-xcmg-v1';
  const PENDING_SHANTUI_KEY = 'campus-job-pending-shantui-v1';
  const PENDING_CCS_GUANGDONG_KEY = 'campus-job-pending-ccs-guangdong-v1';
  const PENDING_OPPLE_KEY = 'campus-job-pending-opple-v1';
  const PENDING_INTIME_KEY = 'campus-job-pending-intime-v1';
  const PENDING_CARIZON_KEY = 'campus-job-pending-carizon-v1';
  const PENDING_SGMICRO_BEIJING_KEY = 'campus-job-pending-sgmicro-beijing-v1';
  const PENDING_JOYIN_KEY = 'campus-job-pending-joyin-v1';
  const PENDING_NFC_KEY = 'campus-job-pending-nfc-v1';
  const PENDING_H3C_KEY = 'campus-job-pending-h3c-v1';
  const PENDING_SMOORE_KEY = 'campus-job-pending-smoore-v1';
  const PENDING_KTC_RECOMMEND_UPDATE_KEY = 'campus-job-pending-ktc-recommend-update-v1';
  const PENDING_GREE_ELECTRONICS_KEY = 'campus-job-pending-gree-electronics-v1';
  const PENDING_ALIBABA_LINGXI_KEY = 'campus-job-pending-alibaba-lingxi-v1';
  const PENDING_QIANLI_KEY = 'campus-job-pending-qianli-v1';
  const PENDING_SUPCON_KEY = 'campus-job-pending-supcon-v1';
  const PENDING_NOVASTAR_KEY = 'campus-job-pending-novastar-v1';
  const PENDING_HUNAN_TALENT_FAIR_KEY = 'campus-job-pending-hunan-talent-fair-v1';
  const PENDING_ROOT_GLOBAL_KEY = 'campus-job-pending-root-global-v1';
  const PENDING_WONDERSHARE_KEY = 'campus-job-pending-wondershare-v1';
  const PENDING_SEPT23_FAIRS_KEY = 'campus-job-pending-sept23-fairs-v1';
  const PENDING_YST_NFS_WANTAI_KEY = 'campus-job-pending-yst-nfs-wantai-v1';
  const PENDING_AERODYNAMICS_KEY = 'campus-job-pending-aerodynamics-v1';
  const PENDING_GUANGQI_KEY = 'campus-job-pending-guangqi-v1';
  const PENDING_RONBAY_KEY = 'campus-job-pending-ronbay-v1';
  const PENDING_SGS_KEY = 'campus-job-pending-sgs-v1';
  const PENDING_CIIC_KEY = 'campus-job-pending-ciic-v1';
  const PENDING_WATERDROP_KEY = 'campus-job-pending-waterdrop-v1';
  const PENDING_YOTTA_KEY = 'campus-job-pending-yotta-v1';
  const PENDING_OPPO_KEY = 'campus-job-pending-oppo-v1';
  const PENDING_FANRUAN_KEY = 'campus-job-pending-fanruan-v1';
  const PENDING_CHINA_NORINCO_KEY = 'campus-job-pending-china-norinco-v1';
  const PENDING_RUANKONG_KEY = 'campus-job-pending-ruankong-v1';
  const PENDING_RUANKONG_UPDATE_KEY = 'campus-job-pending-ruankong-update-v1';
  const PENDING_SUZHOU_XUCHUANG_KEY = 'campus-job-pending-suzhou-xuchuang-v1';
  const PENDING_HESAI_KEY = 'campus-job-pending-hesai-v1';
  const PENDING_HIRAIN_KEY = 'campus-job-pending-hirain-v1';
  const PENDING_SILAN_KEY = 'campus-job-pending-silan-v1';
  const PENDING_ZHONGWEI_SEMICON_KEY = 'campus-job-pending-zhongwei-semicon-v1';
  const PENDING_CEEC_TECH_KEY = 'campus-job-pending-ceec-tech-v1';
  const PENDING_HEIBAIDIAO_KEY = 'campus-job-pending-heibaidiao-v1';
  const PENDING_HEIBAIDIAO_UPDATE_KEY = 'campus-job-pending-heibaidiao-update-v1';
  const PENDING_BJRCB_KEY = 'campus-job-pending-bjrcb-v1';
  const PENDING_HUIJU_JINGCHENG_KEY = 'campus-job-pending-huiju-jingcheng-v1';
  const PENDING_BAIC_KEY = 'campus-job-pending-baic-v1';
  const PENDING_CRRC_ZHUZHOU_KEY = 'campus-job-pending-crrc-zhuzhou-v1';
  const PENDING_YEALINK_KEY = 'campus-job-pending-yealink-v1';
  const PENDING_INTCO_KEY = 'campus-job-pending-intco-v1';
  const PENDING_STICS_KEY = 'campus-job-pending-stics-v1';
  const PENDING_ANT_GROUP_KEY = 'campus-job-pending-ant-group-v1';
  const PENDING_XINHECHENG_KEY = 'campus-job-pending-xinhecheng-v1';
  const PENDING_BEIZI_KEY = 'campus-job-pending-beizi-v1';
  const PENDING_TIAN_SUN_KEY = 'campus-job-pending-tian-sun-v1';
  const PENDING_CSIC_716_KEY = 'campus-job-pending-csic-716-v1';
  const PENDING_RUIJIE_KEY = 'campus-job-pending-ruijie-v1';
  const RUIJIE_URL = 'https://app.mokahr.com/campus_apply/ruijie/136206?recommendCode=DSw378RG#/jobs';
  const PENDING_FAMSUN_KEY = 'campus-job-pending-famsun-v1';
  const PENDING_IWHALECLOUD_KEY = 'campus-job-pending-iwhalecloud-v1';
  const PENDING_CNNC_404_KEY = 'campus-job-pending-cnnc-404-v1';
  const PENDING_COGE_KEY = 'campus-job-pending-coge-v1';
  const PENDING_BANK_OF_CHINA_KEY = 'campus-job-pending-bank-of-china-v1';
  const PENDING_BAICHUAN_ORIGIN_KEY = 'campus-job-pending-baichuan-origin-v1';
  const PENDING_PAPEGAMES_KEY = 'campus-job-pending-papegames-v1';
  const PENDING_BOKE_UPDATE_KEY = 'campus-job-pending-boke-update-v1';
  const PENDING_SHEIN_KEY = 'campus-job-pending-shein-v1';
  const PENDING_TUHU_KEY = 'campus-job-pending-tuhu-v1';
  const PENDING_RELIANCE_METALS_KEY = 'campus-job-pending-reliance-metals-v1';
  const PENDING_CASIC_KEY = 'campus-job-pending-casic-v1';
  const PENDING_FUNPLUS_KEY = 'campus-job-pending-funplus-v1';
  const PENDING_UNISOC_KEY = 'campus-job-pending-unisoc-v1';
  const PENDING_ECOVACS_KEY = 'campus-job-pending-ecovacs-v1';
  const PENDING_ZHPLUS_KEY = 'campus-job-pending-zhplus-v1';
  const PENDING_KE_KEY = 'campus-job-pending-ke-v1';
  const PENDING_AEROSPACE208_KEY = 'campus-job-pending-aerospace208-v1';
  const PENDING_AFTERSHOKZ_KEY = 'campus-job-pending-aftershokz-v1';
  const PENDING_TCL_INDUSTRIES_KEY = 'campus-job-pending-tcl-industries-v1';
  const PENDING_TCL_CSOT_KEY = 'campus-job-pending-tcl-csot-v1';
  const AMPACE_URL = 'https://mp.weixin.qq.com/s/eGRZhO91cdkew0U_0rnwNg';
  const SHENGTONG_URL = 'https://mp.weixin.qq.com/s/Xq2QXikebHe1jlgmJak5UA';
  const OBSBOT_URL = 'https://n8r2cr07gk.jobs.feishu.cn/s/XczE_fi7ipU';
  const HYTERA_URL = 'https://app.mokahr.com/m/campus_apply/hytera/182194?recommendCode=DSJgA1m6#/jobs';
  const QUNHE_URL = 'https://app.mokahr.com/campus_apply/qunhemail/2832?recommendCode=DSzzee3A#/jobs';
  const SMARTSENS_URL = 'https://app.mokahr.com/campus_apply/smartsenstech1/56088?recommendCode=DSWeJQPY#/jobs';
  const KTC_URL = 'https://careerktc.zhiye.com/campus/jobs';
  const KTC_IMAGE_URL = 'https://careerktc.zhiye.com/campus';
  const WOAN_URL = 'https://woanhome.zhiye.com/campus/jobs';
  const ENVISION_URL = 'https://app.mokahr.com/m/campus_apply/envisiongroup/43123?recommendCode=DSZbCUVQ#/jobs?department%5B0%5D=958964';
  const ENVISION_UPDATED_URL = 'https://app.mokahr.com/m/campus_apply/envisiongroup/182094?recommendCode=DSF3U2Kz#/jobs';
  const CHT_GROUP_URL = 'https://cht-group3.zhiye.com/campus/jobs';
  const CRRC_TANGSHAN_FAIR_URL = 'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=043166ff2be54700b4304a35f279a47c&';
  const BOE_FAIR_URL = 'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=692b7084d249476dbff9c20255e64db2&';
  const CSCEC8B_NEW_BUILD_URL = 'https://job.cscec8b.com.cn/recruitment/job/detail/id/2771/';
  const LEADVISION_URL = '';
  const SAIC_URL = 'https://mp.weixin.qq.com/s/ubdSPuLZSdnwQqOK_OoZHg';
  const ENVISION_GROUP_URL = 'https://docs.qq.com/doc/DUHJjeHpLUHNFYnRI';
  const ENVISION_COLLECTION_URL = 'https://docs.qq.com/smartsheet/DUEFqWGN2bWN1WnRS';
  const TAVERN_URL = 'https://app.mokahr.com/campus_apply/tavern/39918?recommendCode=DSjv4BgA#/jobs';
  const LUSTER_URL = 'https://app.mokahr.com/m/campus-recruitment/lusterinc/44882?recommendCode=DSXvwe8A#/jobs';
  const CCTC_PC_URL = 'https://hr.cctc.cc';
  const CCTC_WECHAT_URL = 'https://mp.weixin.qq.com/s/77YC-xaZjUJcVzx18OB9yQ';
  const HELLOTECH_URL = 'https://career.hello-tech.com/campus/jobs';
  const HELLOTECH_UPDATED_URL = 'https://career.hello-tech.com/campus/jobs?shareId=32e0f19e-c270-4629-86f0-7810bc974a47&shareSource=2';
  const HELLOTECH_GROUP_URL = 'https://docs.qq.com/doc/DUHJjeHpLUHNFYnRI';
  const HELLOTECH_COLLECTION_URL = 'https://docs.qq.com/smartsheet/DUEFqWGN2bWN1WnRS';
  const CF_MOTO_URL = 'https://mp.weixin.qq.com/s/0V0b67OuaHiHY_LYQZbWTw';
  const LEAPMOTOR_URL = 'https://mp.weixin.qq.com/s/yk8Cy9PPKuMJj-COKpcCow';
  const VISIONOX_URL = 'https://mp.weixin.qq.com/s/0OAYpLoj4w9iuhBcp-oc0A';
  const ANKER_URL = 'https://t.zhaopin.com/07SdXY';
  const QYXDL_URL = 'https://spicqyxdl.zhiye.com/campus/jobs';
  const METAX_URL = 'https://recruitment.metax-tech.com/campus-recruitment/metax-tech/58131#/jobs?commitment%5B0%5D=%E5%85%A8%E8%81%8C&page=1&pageSize=30';
  const SUNWODA_URL = 'https://sunwodacampus.zhiye.com/campus/jobs';
  const REO_URL = 'https://app.mokahr.com/campus_apply/reo/136006?recommendCode=DSgvfVuR#/jobs';
  const REO_UPDATED_URL = 'https://app.mokahr.com/m/campus-recruitment/reo/136006?recommendCode=DSrR9Tgr&hash=%23%2Fjobs';
  const CHANGYOU_URL = 'https://datayi.cn/w/nPN48Ze9';
  const QUNAR_URL = 'https://datayi.cn/w/xogkXY2o';
  const TAISTING_URL = 'https://www.testingtech.com.cn';
  const TAISTING_ALT_URL = 'https://www.tesitngtech.com.cn';
  const DF_WESTON_URL = 'http://bjxapp.cn/t/NjM0NDQyNA/';
  const IROBOTICS_URL = 'https://app.mokahr.com/campus_apply/3irobotics/147137?recommendCode=DSsd1zWy#/jobs';
  const AMEC_URL = 'https://mp.weixin.qq.com/s/y_GMq4Mo2GR7C08CA6YMgA';
  const LIULIAN_URL = 'https://mp.weixin.qq.com/s/A_4CDvKGdPnXhea-hLlplA';
  const HISENSE_IM_URL = 'https://mp.weixin.qq.com/s/o1DyuenM4Lo9P5oTOKpuRQ';
  const HORIZON_REFERRAL_URL = 'https://actyco.wintalent.cn/actyco/home/receiver/poster/redirect?id=2ce781f69fb84c0101a0194c90914287';
  const HORIZON_OFFICIAL_URL = 'https://horizon-campus.hotjob.cn/';
  const EMDOOR_URL = 'https://emdoor1.zhiye.com/campus/jobs?shareId=be9b6a6c-69c4-40ef-b02e-c442c7090f61&shareSource=2';
  const EMDOOR_GROUP_URL = 'https://docs.qq.com/doc/DUHJjeHpLUHNFYnRI';
  const EMDOOR_COLLECTION_URL = 'https://docs.qq.com/smartsheet/DUEFqWGN2bWN1WnRS';
  const KELONG_URL = 'https://mp.weixin.qq.com/s/yFHIkPSnW_6bzM-V3iZ0gw';
  const SPEECH_URL = 'https://mp.weixin.qq.com/s/nLFzDdUuJujXRJUKf7S1hw';
  const CETC55_URL = 'https://mp.weixin.qq.com/s/7vC70y8n-FRA_50OyWqQXw';
  const ZHUOYU_URL = 'https://we.zyt.com/campus/jobs';
  const BOKE_URL = 'https://boke.jobs.feishu.cn/s/4Lk9kxrjTGo';
  const HANGTIAN_DADAO_URL = 'https://mp.weixin.qq.com/s/7m6zPdMypPIFQrbZXolXbQ';
  const MANBANG_URL = 'https://app.mokahr.com/campus_apply/manbang/94191?recommendCode=DSP2bKg3#/jobs';
  const HUAWEI_CAREER_URL = 'http://career.huawei.com';
  const GITI_URL = 'https://m.liepin.com/company/4197046/?mscid=xy_cx_208';
  const WANNENG_URL = 'http://bjxapp.cn/t/NjM0NDc5Ng/';
  const GEEKPLUS_URL = 'https://mp.weixin.qq.com/s/vnL_bKmZkNEIiMUstSVJLA';
  const RONGZHI_URL = 'https://app.mokahr.com/m/campus_apply/anhuirohgzhirixin/73950?recommendCode=DSqpVauD#/jobs';
  const ZHPLUS_URL = 'https://app.mokahr.com/s/zpvnuk';
  const RONGZHI_KDOCS_URL = 'https://www.kdocs.cn/l/clFIk0zcSZeW';
  const RONGZHI_GROUP_URL = 'https://docs.qq.com/doc/DUHJjeHpLUHNFYnRI';
  const RONGZHI_COLLECTION_URL = 'https://docs.qq.com/smartsheet/DUEFqWGN2bWN1WnRS';
  const DESCENTE_URL = 'https://hm.wshotoai.cn/d/qh6c5l';
  const IROBOTICS_UPDATED_URL = 'https://app.mokahr.com/campus_apply/3irobotics/147137?recommendCode=DSJVWK3N#/jobs';
  const CHIPSEA_URL = 'https://chipsea.zhiye.com/campus/jobs';
  const JEE_URL = 'https://app.mokahr.com/campus-recruitment/ahjy/168235?recommendCode=DSwFMzGC#/jobs';
  const NINEBOT_QR_URL = 'https://qr61.cn/oL88tm/qD8LWQy';
  const NINEBOT_URL = 'https://app.mokahr.com/m/campus_apply/ninebot/45627?recommendCode=DSMjRrNg#/jobs';
  const UNILUMIN_URL = 'https://unilumin.zhiye.com/campus/jobs';
  const CASC_URL = 'https://mp.weixin.qq.com/s/6fcjGXMBMY7Xbmig88zinw';
  const CMB_URL = 'https://mp.weixin.qq.com/s/O1mZ3Tv53R-5Fzlhz47E_A';
  const LEIHU_URL = 'https://qr61.cn/oQyiE6/qZNFPnB';
  const XUZHIYUAN_URL = 'https://mp.weixin.qq.com/s/BhmWtQIoe7CsJ_HVYtW0-A';
  const CITIC_URL = 'https://mp.weixin.qq.com/s/EhXMJWFkpH0RrhTBD3sOmA';
  const ZTE_URL = 'https://mp.weixin.qq.com/s/2HX5S4XCkBA82lzbfZblSg';
  const YONGZHUO_URL = 'https://mp.weixin.qq.com/s/Etwt_eC74g8oFTyFMCh6Ig';
  const NORTHERN_IC_URL = 'https://mp.weixin.qq.com/s/WuYeKyif97boMJFWnCp2tQ';
  const BJ_SPACE_TEST_URL = 'https://mp.weixin.qq.com/s/zpKjfAzzUCYTNFBVC7g43Q';
  const SGMW_URL = 'https://mp.weixin.qq.com/s/UGgf3g2SJPGbZeUY-Vw0aA';
  const CISDI_URL = 'https://xyz.51job.com/External/Apply.aspx?CtmID=8906856';
  const CISDI_FAIR_URL = 'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=7e9b985a5f79454daa2e3465dffb64fa&';
  const AERODYNAMICS_URL = 'https://mp.weixin.qq.com/s/PciGmVpH5VwPNZ7FuFEoxQ';
  const GUANGQI_URL = 'https://mp.weixin.qq.com/s/jjZiJrws2z9wog8JXECkZw';
  const RONBAY_URL = 'http://bjxapp.cn/t/NjM0NTM2Mg/';
  const SGS_URL = 'https://mp.weixin.qq.com/s/_I3R9xQWjt1MPxRPwE708Q';
  const CIIC_URL = 'https://mp.weixin.qq.com/s/elS481zhjj34jdjglziS2w';
  const WATERDROP_URL = 'https://wdh.jobs.feishu.cn/s/VYYyl-ZJIX0';
  const YOTTA_URL = 'https://www.yottagames.com.cn/zh/internal-recommendation?token=dcfc7cdaaf6fea693c7585a095478b78-999602-4194133638&sub=010';
  const OPPO_URL = 'https://careers.oppo.com/university/oppo/campus/post?shareId=17992';
  const FANRUAN_URL = 'https://t6ixa9nyl6.jiandaoyun.com/f/65e1a1308ce7672fded0f0cf?ext=UESTCLWX';
  const CHINA_NORINCO_URL = 'https://mp.weixin.qq.com/s/DIwz1i89y-_JysEYCLKMdw';
  const RUANKONG_URL = 'https://ruankong2027.zhaopin.com';
  const RUANKONG_WECHAT_URL = 'https://mp.weixin.qq.com/s/0Lws6N0RGalW1eGRF8OZGQ';
  const SUZHOU_XUCHUANG_URL = 'https://hm.wshotoai.cn/d/ahm62b';
  const HESAI_URL = 'https://kwh0jtf778.jobs.feishu.cn/s/o-aei9Nv6NU';
  const HIRAIN_URL = '';
  const SILAN_URL = 'https://mp.weixin.qq.com/s/oH1Q-TmWqR51AelHLC23Dw';
  const ZHONGWEI_SEMICON_URL = 'https://hm.wshotoai.cn/d/ahm62b';
  const ZHONGWEI_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const CEEC_TECH_URL = 'http://bjxapp.cn/t/NjM0NTcyNQ/';
  const HEIBAIDIAO_URL = 'https://app.mokahr.com/campus_apply/heibaidiao/54126?recommendCode=DS4J4wuY#/jobs';
  const HEIBAIDIAO_UPDATED_URL = 'https://app.mokahr.com/m/campus_apply/heibaidiao/54126?recommendCode=DSmfdSg2#/jobs';
  const HEIBAIDIAO_GROUP_URL = 'https://qr61.cn/oL88tm/qoR9aw2';
  const BJRCB_URL = 'https://mp.weixin.qq.com/s/EzUk2AwvbB4ewl2tg5f6SQ';
  const HUIJU_JINGCHENG_URL = 'https://mp.weixin.qq.com/s/6hrPAmn86oYA7cbbUxAf8g';
  const BAIC_URL = 'https://mp.weixin.qq.com/s/zowpzo4jhI8uLF95Pv-wXw';
  const CRRC_ZHUZHOU_URL = 'https://mp.weixin.qq.com/s/Fv8jzmgK4JN-VXt0y3VgtA';
  const YEALINK_URL = 'https://yealink.zhiye.com/campus/jobs';
  const INTCO_URL = 'https://global-intco.jobs.feishu.cn/s/T_moUJRWpbM';
  const STICS_FORM_URL = 'https://docs.qq.com/form/page/DR1NiYWZNUmpQa0Fm';
  const STICS_URL = 'https://stics.zhiye.com/campus';
  const ANT_GROUP_URL = 'https://u.alipay.cn/_1k7B5XFUsp4EWTJjqLBXDy';
  const XINHECHENG_FAIR_URL = 'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=db2c25e9a596442caf29af19cab24860&';
  const XINHECHENG_URL = 'https://xinhecheng1.zhiye.com/';
  const BEIZI_URL = 'https://mp.weixin.qq.com/s/kLqlt8S24OUPfAugxSAAaQ';
  const TIAN_SUN_URL = 'https://v.wjx.cn/vm/tewLMTk.aspx';
  const CSIC_716_URL = 'https://mp.weixin.qq.com/s/BsIimkJlyHsV4z_SXY00hA';
  const FAMSUN_URL = 'https://famsun.zhiye.com/campus/jobs?shareId=3800c15e-f35a-45bc-82e7-6793b721078c&shareSource=2';
  const FAMSUN_GROUP_URL = 'https://qr61.cn/oL88tm/q3suoNU';
  const IWHALECLOUD_URL = 'https://iwhalecloud1.zhiye.com/campus/jobs?shareId=8ef0834f-4b8b-4b4a-b003-91c21257fa69&shareSource=2&qr=1&memory=%7B%7D&silence=1';
  const IWHALECLOUD_QA_URL = 'https://qr61.cn/oL88tm/quyXRpc';
  const CNNC_404_URL = 'https://mp.weixin.qq.com/s/5Ni93xP3flsUmRBk-A3I9w';
  const COGE_URL = '';
  const BANK_OF_CHINA_URL = 'https://mp.weixin.qq.com/s/QKPbl5VAV63C_2H1hMsTVg';
  const BAICHUAN_ORIGIN_URL = 'https://careers.baichuan-inc.com/origin-program';
  const PAPEGAMES_URL = 'https://career.papegames.com/s/E3xzfVBWDsg';
  const BOKE_UPDATED_URL = 'https://boke.jobs.feishu.cn/s/ZUuTHDQtON0';
  const SHEIN_URL = 'https://app.mokahr.com/m/campus_apply/shein/2932?recommendCode=DSHVDn9P#/jobs';
  const TUHU_URL = 'https://app.mokahr.com/campus_apply/tuhu/28398?recommendCode=DSC1wTRz#/jobs';
  const RELIANCE_METALS_URL = 'https://m.liepin.com/campus/project-detail/13806544/?mscid=xy_cx_204';
  const CASIC_URL = 'https://m.liepin.com/campus/project-detail/13806358/?mscid=xy_cx_204';
  const FUNPLUS_URL = 'https://app.mokahr.com/campus_apply/funplus01/147931?recommendCode=DS6JVW7X#/jobs';
  const UNISOC_URL = 'https://hm.wshotoai.cn/d/ahm62b';
  const UNISOC_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const ECOVACS_URL = 'https://m.liepin.com/company-jobs/9277742/?mscid=xy_cx_204';
  const KE_URL = 'https://campus.ke.com/campus/jobs?shareId=9f14664a-d1dc-405e-a144-7cb8b1311e6e&shareSource=1';
  const AEROSPACE208_URL = 'https://mp.weixin.qq.com/s/ov1og0w74zXteHitDVmlUA';
  const AFTERSHOKZ_URL = 'https://app.mokahr.com/m/campus_apply/aftershokzhr/36940?recommendCode=DSpVM7fP#/jobs';
  const AFTERSHOKZ_QA_URL = 'https://docs.qq.com/doc/DRkxIU3ZjZ1FUcFBm';
  const TCL_INDUSTRIES_URL = 'https://zhaopin.tcl.com/industries';
  const TCL_CSOT_URL = 'https://wecruit.hotjob.cn/SU6491506a2f9d24316e91b81b/mc/position/campus?acotycoCode=uiqrxh&orgId=100801%2C104101&projectId=308501&recruitType=1&isLimitShowPostScope=1';
  const CAINIAO_URL = 'https://campus-talent.alibaba.com/campus/position?campusShareCode=PX%2FAnrETKRgsNBRj9tQ7Ak%2Fbx7rdG42KjWR9%2F7ziK24%3D&batchId=100000540002';
  const FANDOW_URL = 'https://job.fandow.com?pushCode=DOY81JC';
  const FANDOW_GROUP_URL = 'https://docs.qq.com/doc/DUHJjeHpLUHNFYnRI';
  const FANDOW_COLLECTION_URL = 'https://docs.qq.com/smartsheet/DUEFqWGN2bWN1WnRS';
  const HIKVISION_URL = 'https://campushr.hikvision.com';
  const UBTECH_URL = 'https://mp.weixin.qq.com/s/B7ozYeztCo5hmM4mU2mIng';
  const TPLINK_GLOBAL_URL = 'https://join.tplinkglobal.com/share/jobs?share_id=2090630979320004610&share_type=qr';
  const TPLINK_CN_URL = 'https://hr.tp-link.com.cn';
  const MOONTON_URL = 'https://moonton.jobs.feishu.cn/s/nAKxKwhsM4o';
  const MOONTON_GROUP_URL = 'https://docs.qq.com/doc/DUHJjeHpLUHNFYnRI';
  const MOONTON_COLLECTION_URL = 'https://docs.qq.com/smartsheet/DUEFqWGN2bWN1WnRS';
  const CVTE_URL = 'https://campus.cvte.com/';
  const SZKINGDOM_DIRECT_URL = 'https://szkingdom1.zhiye.com/campus/jobs?shareId=92a8c6fe-738e-4856-abdc-f5e9111e1d57&shareSource=2&qr=1';
  const SZKINGDOM_OFFICIAL_URL = 'https://szkingdom1.zhiye.com/campus/jobs';
  const HOYMILE_URL = 'https://mp.weixin.qq.com/s/eLma5C8uOm3T42Fyh5ywuw';
  const OBSBOT_TEXT = `OBSBOT 寻影2027届秋季校园招聘正式启动！
关于我们
OBSBOT寻影 2016年创立于深圳，以 “实现人类影像自由” 为品牌使命，专注影像自动化赛道。公司产品已为全球150多个国家和地区的超百万用户提供服务，团队总人数超过800人，销售业绩逐年攀升
工作地点：深圳/成都/杭州/西安
招聘对象
2027届本科及以上学历毕业生
热招岗位
算法类 | 软件类 | 硬件类 | 产品类 | 测试&项目管理类 | 销售类 | 管培生类
投递链接：${OBSBOT_URL} 欢迎各位同学投递简历，加入寻影！`;
  const HYTERA_TEXT = `海能达2027届校招正式启动
【公司简介】
海能达是总部位于中国深圳的全球化民营上市公司,1993年成立,是全球领先的专用通信及解决方案提供商，行业头部企业。
【招募需求】
6大职类，30+岗位，深圳、东莞等多base地可选择
技术类、产品类、设计类、职能类、市场类、供应链类等
【福利待遇】
薪酬体系：具有竞争力的薪酬、年度奖金、项目奖金、灵活激励、出差补贴
健康保障：五险一金、雇主责任险、海外出差商旅险、年度体检、9天补充带薪假、弹性工作制
生活关怀：过渡住宿、员工食堂、年度旅游、员工俱乐部、节日礼品
【薪酬待遇】
算法/海外营销:14-22k、硬件开发岗位:14-21k、软件开发岗位:12-20k、国内营销岗位:10-15k、部分岗位最高薪酬30k/月，以offer为准
【校招官网】
${HYTERA_URL}`;
  const QUNHE_TEXT = `群核科技2027届秋招正式启动，27届校招生+储备实习生岗位开放！欢迎大家投递！
【公司介绍】群核科技是全球领先的空间智能服务提供商，致力于推动人工智能加速进入物理世界！公司围绕空间智能相关技术构建了“空间编辑工具-空间数据-空间大模型”的业务飞轮，技术和产品被广泛应用于空间设计、3D内容创作、电商广告营销生成、文化遗产保护、工业数字孪生及智能体训练等千行百业。
【岗位包括】科研算法、AI Infra、产品经理等方向（其中【星核人才计划】欢迎博士同学投递）
【工作地点】杭州
【推荐码】DSzzee3A
【投递链接】${QUNHE_URL}`;
  const SMARTSENS_TEXT = `热爱，让所现超越所见！ 思特威电子科技2027届秋季校招火热进行中
【我们是谁】2022年5月20日，在上海证券交易所科创板上市；安防监控&车载电子应用领域市场占有率全球前列；产品覆盖安防监控、机器视觉、车载电子、智能手机等多场景应用领域的全性能需求
【校招流程】网申&内推→笔试(如有)→面试→Offer发放；具体流程以个人收到的实际邮件通知为准
【热招岗位】数字电路设计工程师、模拟电路设计工程师、数字后端工程师、图像算法工程师、AI芯片软件工程师、像素验证工程师、像素仿真工程师、平台验证工程师、软件开发工程师、项目管理工程师、技术支持工程师、供应链工程师等岗位热招中
投递简历：${SMARTSENS_URL}`;
  const KTC_TEXT = `康冠科技2027届秋季校园招聘正式启动
【关于康冠】一家全球性平板显示解决方案服务商；专注于为客户提供深度定制化、差异化的平板显示产品；并向全世界输出中国智造解决方案。
金秋揽才·焕彩新生；职等你来·竞耀康冠；【岗位池已装满】技术研发、产品设计、市场运营等多类别岗位全面开放！
投递简历：${KTC_URL}
推荐码：EVVPT9（填写推荐码简历优先筛选）`;
  const WOAN_TEXT = `卧安机器人2027届秋季校园招聘正式启动！【关于卧安】
卧安机器人（OneRobotics，6600.HK）是全球领先的AI具身家庭机器人系统提供商。2025年12月30日，我们在香港交易所主板挂牌上市，成为“AI具身家庭机器人第一股”。
发明数量全国NO.1 | 研发投入20%+ | 研发占比50%+；全球首款AI网球机器人 | 全球首款AI陪伴机器人 | 为家庭场景打造的具身人形智能机器人
【热招岗位】算法工程师、运营管培生、人力资源专员
【薪酬激励】试用期薪资不打折，每年两次调薪窗口；月度/季度绩效奖金、年终奖及专项激励
【福利保障】六险一金、体检福利、搬家补贴、生日礼物、法定节假日福利
投递链接：${WOAN_URL}
推荐码：EVKR08`;
  const ENVISION_TEXT = `【远景能源2027届秋招内推热招中】零碳新赛道，梦想偏执狂！
一、我们是：《时代》周刊评选的“全球100家最具影响力企业”，能源行业的“绿巨人”。作为引领中国风电产业发展与变革的头部企业，远景能源拥有全球领先的风电、智慧储能、绿氢的产品与新型能源系统整体解决方案，成为全球企业、政府与机构的“零碳技术伙伴”
二、【招聘对象】2025-2027届（工科背景可积极投递）
三、【面向专业】电气、计算机、机械、控制自动化、人工智能、材料、能动、土木等理工科
四、【招聘方向】专业覆盖研发、产品、工艺、制造、供应链、质量管理、市场&解决方案、工程管理、综合类、设计类、项目管理、职能等
五、【工作地点】遍布全国，海外包括东南亚、中亚、亚非、欧洲、拉美等
六、【福利】落户支持、补充公积金、商业保险、利润分享、食堂、下午茶、健身房、年假十天起
七【网申链接】${ENVISION_URL}
【内推码】DSZbCUVQ
划重点：本次内推项目仅针对「远景能源」的岗位（点开上方链接，筛选业务部门选择远景能源，共146个岗位）
远景能源秋招交流群：663984497
秋招交流群：${ENVISION_GROUP_URL}
更多2027届校招内推信息，可查看腾讯文档《2027届校招内推信息集合》
${ENVISION_COLLECTION_URL}`;
  const ENVISION_UPDATED_TEXT = `远景能源2027秋招正式启动！13大类别，140+岗位职等你来！
【公司简介】远景能源是全球领先的智能风电、智慧储能系统和绿氢解决方案公司；《时代》周刊评选的“全球100家最具影响力企业”；在全球设立超20个运营总部和研发中心、拥有超60个制造基地。
【招聘岗位】研发、工艺、制造、产品、市场、供应链、质量管理、工程管理、综合类等140+岗位。
【工作地点】遍布全国，海外包括东南亚、亚非、欧洲、美洲等
【福利】落户支持、补充公积金、商业保险、利润分享、食堂、下午茶、健身房、年假十天起等
【内推链接】${ENVISION_UPDATED_URL}
【推荐码】DSF3U2Kz（内推投递，简历优先筛选，面试流程加快！）`;
  const CHT_GROUP_TEXT = `扬腾创新2027届精英计划｜百万年薪，不限专业，全球布局
万亿美金汽配赛道，覆盖全球超40个国家，数智驱动的全球汽配领军企业，等你加入！
开放方向：算法、战略、供应链、运营、技术研发等多序列
顶尖人才年薪可达100W；专属导师带教+双通道晋升（管理/专家）；六险一金、人才补贴、低价人才公寓、丰厚年终奖；全球业务布局，成长空间不设限。
投递简历：${CHT_GROUP_URL}
推荐码：EV3MVV（填写推荐码简历优先筛选）`;
  const CRRC_TANGSHAN_FAIR_TEXT = `【9.8宣讲会】中车唐山机车车辆有限公司2027届校园招聘
举办时间：2026-09-08 13:30 至 2026-09-08 15:00
举办地点：冶金楼616安耐克报告厅
面向学生层次：硕士
详细信息：${CRRC_TANGSHAN_FAIR_URL}`;
  const BOE_FAIR_TEXT = `【9.8宣讲会】Hi YOU京东方2027届全球校园招聘正式启动！
举办时间：2026-09-08 19:00 至 2026-09-08 21:00
举办地点：教职工礼堂
面向学生层次：本科、硕士、博士
详细信息：${BOE_FAIR_URL}`;
  const CSCEC8B_NEW_BUILD_TEXT = `「聚新星·建未来」
中建八局新型建造工程有限公司
2027届校园招聘简章
公司是中国建筑集团旗下中国建筑第八工程局有限公司的全资子公司，总部位于上海，是中建八局旗下集设计、科研、咨询、制造、施工于一体的现代化钢结构专业公司，业务覆盖建筑安装、钢结构加工、工程设计、智能制造与设备租赁等板块，并拓展风光储等新能源业务。
招聘对象：2027届应届毕业生，本科及以上学历
招聘专业：
博士管培生：结构工程、理论力学等与钢结构相关专业
新业务类：电气工程及其自动化、建筑电气与智能化、水利水电、道路与桥梁工程等相关专业
工程技术类：土木工程、工程力学、工程管理、工程造价、材料科学与工程、金属材料工程、安全工程、测绘工程、焊接（材料成型及控制工程）、钢结构建造技术、机械设计制造及其自动化等相关专业
职能管理类：会计学、财务管理、审计学、财政学、企业管理、法学、人力资源管理、新闻学、汉语言文学、外语类等相关专业
基本条件：通过中建测评；能适应建筑施工行业环境和工作地域分配；具备团队精神及沟通协调能力；身心健康、积极乐观。
薪酬福利：职级工资、岗位工资、企业效益奖、专项奖金、项目兑现；工作餐补、交通补贴、通讯补贴、办公补贴、年功津贴、区域补贴、职称津贴、考证激励等；五险一金、补充公积金、企业年金、项目免费食宿、落户上海、带薪年假、健康体检、节日福利等。
投递地址：${CSCEC8B_NEW_BUILD_URL}
面试沟通QQ群：1108615105
说明：简章还提供扫码投递和招聘网站投递方式。`;
  const LEADVISION_TEXT = `北京领视智联科技有限公司
2027届校园招聘简章
一、公司简介
北京领视智联科技有限公司（以下简称“北京领视”）是一家专注于机器视觉领域的创新型企业，深耕印刷包装表面检测领域，确立了行业领先地位。公司以北京、青岛为双核心枢纽，业务辐射全国主要制造业集群，并积极开拓海外市场。公司专注于书刊、软包、烟包、奶包、卫包、标签等印刷包装行业的智能检测，为制造业客户提供高精度、高效率的视觉检测解决方案。
二、招聘对象
面向2027届全日制应届毕业生，本科及以上学历；机械、电气、自动化、光学、计算机、软件工程、电子信息、印刷、包装等相关专业优先。
三、招聘岗位（共7个）
1. 技术支持工程师：全国各省市，可根据户籍地及客户分布设置岗位；本科及以上；机械、电气、自动化、光学、计算机、印刷等相关专业。
2. 销售工程师：华东、华南、东北、华北等区域，具体城市不限；本科及以上；自动化、机械、电气、印刷包装、光学、计算机等相关专业。
3. 软件研发工程师：北京、青岛；硕士及以上；软件工程、计算机、自动化、电子信息、机械电子等相关专业。
4. 电气工程师：北京、青岛；本科及以上；电气、自动化、机械等相关专业。
5. 机械设计工程师：北京、青岛；本科及以上；机械、自动化、电气等相关专业。
6. 装调工程师：青岛；本科及以上；电气、自动化相关专业。
7. 光学工程师：北京；硕士；光学、机械、电子、计算机或印刷工程等相关专业。
四、薪酬福利
月工资由基本工资、绩效工资、各类补贴及其他奖励构成；年终奖金上不封顶；年度调薪机会；销售岗位另享销售提成及出差补贴；缴纳七险一金，住房公积金12%比例缴纳；提供餐费、话费、出差、住房（宿舍）补贴；免费体检、节假日礼品、茶歇、春节假期等福利。
五、招聘流程
简历投递→简历筛选→面试选拔（部分技术岗位视情况设置笔试或专业测评）→录用签约→入职报到。
六、投递与联系方式
简历投递邮箱：liweifu@leadvisioninc.com
联系电话（同微信）：付经理 13381383395
说明：简章未提供可复制的网申 URL，另有扫码投递方式。`;
  const SAIC_TEXT = `上汽集团
微信公众号文章：${SAIC_URL}`;
  const GBITS_URL = 'https://hr.g-bits.com/mobile/index.html#/?referralCode=U1R56F';
  const GBITS_TEXT = `吉比特&雷霆游戏27届秋招火热启动！
关于我们：旗下有《问道》《问道手游》《一念逍遥》《奥比岛：梦想国度》等游戏。
开放岗位：游戏策划类、研发技术类、美术设计类、产品运营类、市场营销类、公共职能类等。
福利待遇：管理扁平化，培养机制健全，成长通道清晰；年底双薪、年终奖、每年两次调薪机会；每月房补、12%公积金、补充商业保险、最高100万5年免息购房借款、电影日、团建和兴趣社团等。
工作地点：深圳、厦门。
投递链接：${GBITS_URL}
推荐码：U1R56F；不限专业，欢迎热爱游戏的同学投递简历！`;
  const HOLLYLAND_URL = 'https://hollyland.zhiye.com/campus/jobs';
  const HOLLYLAND_TEXT = `HOLLYLAND昊一源2027届校招重磅开启！
面向敢闯敢创新的2027届应届毕业生，提供算法、软硬件研发、产品、营销、职能等多元岗位。
硬核福利：双休、六险一金、6个月免费公寓住宿、团建活动、双导师带教、专业/管理双晋升通道。
工作地点：深圳、武汉。
企业平台：1400+高新企业平台，高占比研发团队，真实项目实战与全链路系统化培养。
投递通道：${HOLLYLAND_URL}
推荐码：EV3M83（填写推荐码简历优先筛选）。`;
  const MIDEA_REFERRAL_URL = 'https://careers.midea.com/recruit-school-wechat/job?mvp_code=MX6344&type=1';
  const MIDEA_OFFICIAL_URL = 'https://careers.midea.com/';
  const MIDEA_TEXT = `美的集团2027届校园招聘
美的集团面向2027届毕业生开放多个方向岗位，主要包括：研发技术、信息技术、制造技术、供应链物流、国内营销、海外营销、财务金融、综合管理等。
美的集团校招推荐码：MX6344
内推通道链接：${MIDEA_REFERRAL_URL}
官方校招地址：${MIDEA_OFFICIAL_URL}
通过推荐通道提交申请，可直接填写推荐码 MX6344。
2027届校招交流群：QQ群 1108539480。群内会持续同步美的最新校招信息、官方投递入口与推荐码、笔试/面试时间节点、校招备考资料及求职经验等。`;
  const ZURU_URL = 'https://wecruit.hotjob.cn/SU69fd8f7f1f17c372512fdd19/mc/position/campus?acotycoCode=smwkew&projectId=100501&recruitType=1&isLimitShowPostScope=1';
  const ZURU_QA_URL = 'https://docs.qq.com/doc/DRkxIU3ZjZ1FUcFBm';
  const ZURU_TEXT = `全球TOP级玩具外企ZURU2027校园招聘启动！
公司简介：全球排名前十玩具外企，在全球拥有超过5000名雇员，设有32个办事处和国际办公室，核心office在中国，深圳为研发中心，产品远销121个国家和地区，年销售额超20亿美元。
招聘亮点：外企待遇与工作WLB，六险一金、包吃住、双休；带薪撸宠、入职旅行、朝九晚六并支持弹性上班。
招聘岗位：商科、创意、设计、研发、制造五大类岗位。
工作地点：广州、上海、深圳、东莞、惠州、中山。
答疑交流：${ZURU_QA_URL}
内推链接：${ZURU_URL}
内推码：smwkew（内推投递，简历优先筛选）。`;
  const NEUEHCT_URL = 'https://neuehct.jobs.feishu.cn/s/jhOwEIqF1TU';
  const NEUEHCT_TEXT = `智驾新程 neueHCT 招聘信息
智驾新程 neueHCT 由全球汽车零部件巨头德国欧摩威集团（原大陆集团汽车子集团）与中国 AI 芯片领军企业地平线合资组建。
热招岗位覆盖：测试、软件、算法、项目管理、系统、硬件、质量等领域。
工作地点：上海、北京、南京。
福利保障：六险一金（公积金比例12%）、带薪年假、全薪病假、租房补贴、年度体检、节日福利、团建旅游等。
招聘链接：${NEUEHCT_URL}`;
  const HUAYOU_URL = 'https://campus.huayou.com';
  const HUAYOU_TEXT = `华友钴业2027届全球校招正式启动
华友钴业是全球领先的锂电材料制造企业，钴产能规模全球第一，锂电材料产能规模全球TOP3；员工总数超35000人，总资产超千亿元，拥有140余家全资控股、参股公司和分支机构。
招聘岗位：化学化工、材料、冶金、机械、电气、矿业、土木工程、安环、计算机、供应链、市场营销、人力资源、行政管理、外语等十余类专业方向。
工作地点：浙江桐乡（总部）、浙江衢州、广西玉林、四川成都、天津等国内区域，以及印度尼西亚、津巴布韦、刚果（金）、匈牙利等海外产业基地。
福利待遇：评先奖金、健康体检、五险一金、带薪年假、通讯补贴、餐饮福利、节日福利；员工公寓、员工健身房、兴趣社团、团建活动；全球轮岗机会、国际化事业平台、行业竞争力薪资及多地人才补贴，海外补贴更优厚。
一键投递：${HUAYOU_URL}
更多校招详情可扫码进群咨询，宣讲会和面试安排将在群内同步。`;
  const QDZH_TEXT = `青岛征和股份有限公司2027届校园招聘“链不凡，汇非凡”
青岛征和工业股份有限公司是国内链传动行业领军企业、链系统技术领导者，中国链传动行业首家A股上市公司（证券代码003033），成立于1999年，服务全球客户2000余家。
招聘岗位：技术研发类、职能类、生产工艺类。
专业要求：机械设计制造及其自动化、机械工程、自动化、人工智能、计算机、机器人、金属材料、车辆工程、智能车辆工程、材料成型、市场营销、国际贸易、英语、俄语、越南语、泰语、西班牙语、财务管理、会计、人力资源管理、工商管理、企业管理、行政管理、电视广播编导等相关专业。
薪资待遇：转正后本科起薪约10-15万/年，硕士约13-20万/年，博士年薪40万以上；具体薪酬面试谈薪。工资构成为基本工资+奖金+津补贴。
福利：五险一金、免费三餐、免费住宿、免费班车、福利津贴、节日福利、健康体检、婚丧生育慰问、陪产假等。
工作地点：山东青岛平度、上海闵行、浙江湖州、泰国、俄罗斯。
应聘条件：本科以上学历，通过CET-4；机械相关岗位需具备扎实机械原理基础和机械设计经验；身心健康、品行端正、有责任心及团队合作精神。
简历投递：qdzhxyzp@163.com；邮件主题标明“姓名+学校+专业+工作地”，简历请备注户籍地或意向工作地。`;
  const SCC_URL = 'https://scc.zhiye.com/campus/jobs';
  const SCC_TEXT = `上市国企-深南电路2027届北京科技大学秋招线下宣讲会
深南电路是全球PCB企业TOP 4、中国电子电路行业协会理事长单位，年营收超两百亿。
校招生福利：专属晋升、调薪、培养通道；福利宿舍、福利食堂、六险一金；节日福利、各类补贴、带薪年假。
工作地点：深圳、广州、无锡、南通、成都、上海、泰国。
宣讲会时间：2026年9月15日17:30-18:00。
宣讲会地点：北京科技大学时代凌宇报告厅。
招聘需求：2400+，研发技术类、智能制造类、市场客户类、职能类、博士岗位等。
网申链接：${SCC_URL}
更多详情请关注“深南电路招聘”微信公众号。`;
  const CSCEC3B_INNOVATION_URL = 'http://zhaopin.cscec3b.com.cn/';
  const CSCEC3B_INNOVATION_TEXT = `中国建筑·中建三局科创公司2027届校园招聘开始投递
中建三局2021年3月组建成立，作为建筑工业化投资、建造、科研专业化平台，承担建筑科技升级使命，发展绿色建造、智能建造技术。目前拥有8家全资分公司，是国内头部智能建造全链条服务企业。
平台方向：中国建筑成员企业，中建三局智能建造全产业链实施平台，聚焦智能建造技术研发、智能工厂、建筑机器人、钢结构工程，推动建筑科技升级。
待遇：薪酬福利具有行业竞争力，薪酬面议。
学历要求：应届本科、硕士、博士生，具体以招聘简章为准。
工作地点：武汉、北京、上海、深圳、成都、西安。
需求专业：智能建造、土木工程类、工程管理类、安全管理、人力资源管理类。
投递方式：招聘简章内扫码快速投递；或通过中建三局科创公司官网投递：${CSCEC3B_INNOVATION_URL}（原文注明待开放）。`;
  const FUTECH_URL = 'https://app.mokahrcom/campus_apply/evtech/47503?recommendCode=DSSjBARX#/jobs';
  const FUTECH_TEXT = `富特科技2026校园招聘启动！
富特科技致力于成为全球领先的新能源汽车核心零部件供应商，已于2024年上市（股票代码301607）。研发中心位于杭州市、西安市，制造中心位于湖州安吉，在法国设有全资子公司，是新能源汽车细分领域OBC+DCDC研发团队之一。
校招岗位：技术研发类、制造管培类、职能类。
简历投递通道：${FUTECH_URL}`;
  const SEPT9_FAIR_DATA = [
    {company:'航空工业昌飞',title:'2026 年秋季校园招聘宣讲会',time:'2026-09-09 13:30-15:00',place:'时代凌宇报告厅',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=8ca4dee8164343139f0a0ecbb0349308&'},
    {company:'中国电信股份有限公司乌鲁木齐分公司',title:'2027 年秋季校园招聘宣讲会',time:'2026-09-09 13:30-15:00',place:'招生就业多功能厅',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=5a6d3b69509541f19ef673cccab7fea0&'},
    {company:'苏州锦艺新材',title:'2027 届校园招聘宣讲会',time:'2026-09-09 15:30-17:00',place:'逸夫楼701',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=74a0e0cec6a04741b0965d1b90ccac8c&'},
    {company:'西部金属材料股份有限公司',title:'2027 年度博硕士招聘信息',time:'2026-09-09 15:30-17:00',place:'时代凌宇报告厅',audience:'硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=957aa4475e7a45a7a600a496607917be&'},
    {company:'武汉嘉晨电子技术股份有限公司',title:'“嘉才成林·晨翼启航”2026 届研发岗校园招聘',time:'2026-09-09 15:30-17:00',place:'机电信息楼616',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=d077a30ca3994572a0db3f501524accc&'},
    {company:'中国工商银行深圳市分行',title:'2027 年校园招聘宣讲会',time:'2026-09-09 19:00-21:00',place:'时代凌宇报告厅',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=e96d249c4e484af1b1b53c6eae48ae41&'},
    {company:'新和成',title:'2027 届秋季招聘',time:'2026-09-09 19:00-21:00',place:'机电信息楼616',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=db2c25e9a596442caf29af19cab24860&',merge:true},
    {company:'中景芯创',title:'2027 届校园招聘宣讲会',time:'2026-09-09 19:00-21:00',place:'逸夫楼401',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=6bb200efe79947909f653218c58fb19a&',merge:true}
  ];
  const GREE_URL = 'https://m-zhaopin.greeyun.com/';
  const GREE_QA_URL = 'https://qr61.cn/oL88tm/qYw6wOQ';
  const GREE_TEXT = `格力电器27届秋招启动
逐梦新程，创见未来！格力电器2026届校招全面启动，期待携手同行，用创造改变世界。
产业布局：家用消费品，包括空调、冰洗、生活电器、智能家居等；工业装备，包括核心零部件、电机、高端装备、精密模具等。
成长发展：3-6-1培养体系、职场导师、职业发展双通道、在职学历提升、职称自主评定。
幸福格力：快乐双休、食住行娱、全面福利、人才激励、节日慰问、年轻团队、海滨城市工作环境等。
校招岗位：技术研发、信息技术、技术支持、制造技术、经营销售、行政职能、采购物流七大类，包含结构设计、制冷技术、电气设计、电控软硬件等50+岗位。
 投递方式：关注“格力电器招聘”公众号→校园招聘→投递简历；网申链接：${GREE_URL}`;
  const GREE_UPDATED_TEXT = `格力电器27届秋招启动
产业布局：家用消费品（空调、冰洗、生活电器、智能家居等）；工业装备（核心零部件、电机、高端装备、精密模具等）。
成长发展：3-6-1培养体系、职场导师、职业发展双通道、在职学历提升、职称自主评定。
校招岗位：技术研发、信息技术、技术支持、制造技术、经营销售、行政职能、采购物流七大类，包含结构设计、制冷技术、电气设计、电控软硬件等50多个岗位。
幸福格力：快乐双休、食住行娱、全面福利、人才激励、节日慰问、年轻团队、海滨城市工作环境等。
投递方式：关注“格力电器招聘”公众号，选择“校园招聘”投递；网申链接：${GREE_URL}
官方推荐码：BGREE54231
校招岗位答疑：${GREE_QA_URL}
海报说明：招聘对象为2027届本科、硕士、博士毕业生，具体岗位和行程以官方招聘页面为准。`;
  const CNKI_FAIR_URL = 'https://mp.weixin.qq.com/s/-YueYc0vnIO5sdRyFrDpkg';
  const CNKI_URL = 'https://cnnc.zhiye.com/custom/campus?hideMenu=1&c1=628';
  const CNKI_TEXT = `【现场宣讲】中核集团-同方知网数字科技有限公司（中国知网）
宣讲时间：2026-09-15 15:30
宣讲地点：逸夫楼302
宣讲链接：${CNKI_FAIR_URL}
企业网申链接：${CNKI_URL}
同方知网数字科技有限公司是中国核工业集团所属同方股份有限公司的全资子公司，旗下“中国知网”“CNKI”服务全球3.5万家机构、1.5亿个人，访问量居全球科教类网站前三名。公司聚焦管理数智化、工业智能化、信创集成服务，支撑构建数字核工业。
需求专业：计算机科学与技术、人工智能、软件工程、信息安全、智能制造、数字出版、信息系统、大数据等。
福利待遇：七险二金、住房补贴、餐补、防暑取暖补贴、年度体检、带薪年假、调休假、节日及生日福利、双导师帮带、职业发展双通道等。`;
  const SF_AUTO_UPDATE_TEXT = `四方股份2027届校园招聘-北京科技大学站
宣讲时间：9月16日（周三）14:00
宣讲地点：逸夫楼707
企业亮点：主板上市电力行业企业；智能电网、智慧配用电、新能源与储能业务持续发展。
薪酬福利：研发类硕士28W起，博士50W起；八险一金、交通补贴、餐饮补贴、春节福利假、落户指标、节日礼金、生育礼金等。
业务方向：继电保护、电力系统、源网荷储、电力电子（PCS、SST等）、直流输电、新型配电网、储能等。
研发类岗位：嵌入式软件开发、嵌入式硬件研发、系统软件开发、智能体开发、多模态算法、FPGA研发、主回路设计、结构研发等。
工程、市场、职能类岗位：电气/机械设计、工程服务、调试、技术支持、项目管理、国内外销售、销售支持、质量、计划、人力、法务、财务、品牌宣传等。
需求专业：电气工程、控制科学与工程、计算机、电子信息、机械工程、人工智能、工商管理、心理学、法学等。
工作地点：北京、武汉、南京、湖州、保定、西安、深圳；优秀毕业生享受北京落户机会。
PC端投递：https://sf-auto1.zhiye.com/campus/jobs
手机端：关注“四方继保招聘”公众号，点击“加入四方”-“27届校园招聘”。`;
  const XINHECHENG_UPDATE_URL = 'https://mp.weixin.qq.com/s/RQVI3BVrnw9RQTDFkC-8TA';
  const XINHECHENG_UPDATE_TEXT = `新和成2027届校园宣讲会-北京科技大学专场
宣讲时间：9月9日（周三）19:00-21:00
宣讲地点：机电信息楼616
工作地点：浙江新昌、上虞；山东潍坊；黑龙江绥化；天津；海外。
招聘专业：化学化工类、材料类、生物类、药学制药类、过程装备与控制类、自动化类、机械类、电气、土木等专业，其他专业也有匹配岗位。
投递方式：网申地址 ${XINHECHENG_URL}；扫描二维码加入微信交流群；校招推文详情：${XINHECHENG_UPDATE_URL}
到场参加宣讲会有精美礼品。`;
  const SUZHOU_DAY_URL = 'https://docs.qq.com/sheet/DT2xVd2xxbVd0VFBP?tab=000002';
  const SUZHOU_DAY_TEXT = `“校园苏州日”全国秋招北京大学专场系列活动
活动类型：现场面试及招聘双选活动，100+企事业单位参加。
时间：2026年9月15日（周二）14:30-18:00
地点：北京大学邱德拔体育馆外广场及二楼平台
岗位领域：事业单位、国企、上市公司等，覆盖自动化、计算机、半导体、生物医药、化工化学、医院、高校等方向。
部分参会单位：苏州国家实验室、量子科技长三角产业创新中心、河海大学苏州研究院、江苏第三代半导体研究院有限公司、大飞机江苏太仓研究中心、苏州市立医院、昆山市第一人民医院、苏州科技大学、苏州工业职业技术学院等。
腾讯文档：校园苏州日岗位清单：${SUZHOU_DAY_URL}
活动提示：实名制入场，可进群获取报名链接；外校同学根据报名人数确定是否安排大巴接送。QQ群：2161073734；联系电话：18951676577。`;
  const AAC_URL = 'https://talent.aactechnologies.com/campus/m/position/list?external_referral_code=MWJAQEU';
  const AAC_TEXT = `瑞声科技2027届校园招聘
瑞声科技是全球感知体验解决方案提供商，业务涉及声学、光学、触感、传感器及半导体等领域。
招聘岗位：技术类包括声学、光学、马达、芯片、算法、仿真、结构、电气、模具、散热、质量、项目管理等；职能类包括会计、供应计划、生产计划、采购、财务BP、HRBP、法务等。
工作地点：常州、深圳、南京、南宁、上海、苏州、武汉、北京、重庆，以及越南、马来西亚等，具体以职位页面为准。
校园大使推荐码：AAC27Q045。申请时必须填写“校园大使推荐码”，不是普通内推码。
投递入口：${AAC_URL}
招聘流程：网申→测评→面试→Offer。
岗位具体学历、专业、毕业时间、工作地点及招聘安排以瑞声科技官方招聘页面为准。
2027届校招备用QQ群：1121876496。`;
  const SINEXCEL_URL = 'https://app.mokahr.com/campus_apply/sinexcel/74287?recommendCode=DS14WS5m#/jobs';
  const SINEXCEL_TEXT = `盛弘股份2027届校招正式启动
上市公司、专精特新、国家级高新技术企业、全球新能源500强，聚焦储能、充换电、新能源与电力赛道。
招聘对象：2027届本硕博应届生。
工作地点：深圳、西安、苏州、惠州，支持海外派驻/出差。
热招方向：电力电子硬件、DSP软件、嵌入式软件、结构、测试、EMC、产品管理、技术营销、管培生等。
薪酬福利：行业高薪、年终奖、五险一金、股票期权；早九晚六、周末双休、带薪年假；提供住宿/住房补贴、免费班车；一对一导师带教和应届生培养体系。
投递链接：${SINEXCEL_URL}`;
  const HKACO_URL = 'https://hkaco.zhiye.com/campus/jobs';
  const HKACO_TEXT = `虹科电子2026届校园招聘
虹科电子科技有限公司成立于1995年，总部位于广州，致力于技术和产业革新，推动国际化视野下的创新与行业发展。
招聘岗位：技术研发类、销售类、职能类、市场类、管培生等。
福利：五险一金、丰厚薪资、补充商业保险；出差补贴、季度奖金、多种下午茶；带薪病假、双休、年度免费体检；学习补贴、工作手机、员工生日会等。
投递简历：${HKACO_URL}
专属推荐码：ESKMAR`;
  const BLUEINTERACTIVE_URL = 'https://app.mokahr.com/m/campus_apply/blueinteractive/38434?recommendCode=DSHVPrQM#/jobs';
  const BLUEINTERACTIVE_GROUP_URL = 'https://docs.qq.com/doc/DUHJjeHpLUHNFYnRI';
  const BLUEINTERACTIVE_COLLECTION_URL = 'https://docs.qq.com/smartsheet/DUEFqWGN2bWN1WnRS';
  const BLUEINTERACTIVE_TEXT = `深蓝互动2027届校园招聘正式启动！
深蓝互动成立于2020年，首款产品《重返未来：1999》于2023年全球公测，UE5全新开放世界项目已启动研发。
工作地点：广州。
招聘对象：毕业时间为2026年9月至2027年8月的27届毕业生。建议简历尽量与投递岗位相关。
招聘岗位：
美术设计类：场景原画、特效原画、角色原画、角色建模、地编、特效、动作、视频编导、GUI、插画、Live2D动画。
技术开发类：引擎开发、U3D开发、移动端开发、Java开发、测试（综合向/战斗向/美术向）。
游戏策划类：文案、叙事、技术、系统、关卡、关卡数值、战斗、战斗表现、战斗数值、活动策划。
市场发行类：日本市场营销策划；产品支持类：产品PM。
内推投递链接：${BLUEINTERACTIVE_URL}
内推码：DSHVPrQM。
福利：年底双薪、项目奖金、年度薪酬回顾；周末双休、五险一金（公积金全额买）、商业保险、年度体检；零食饮料咖啡、下午茶、餐补；入职培训、新人导师、季度团建、年假及节日/生日福利等。
秋招交流群：${BLUEINTERACTIVE_GROUP_URL}
2027届校招内推信息集合：${BLUEINTERACTIVE_COLLECTION_URL}`;
  const STREAMAX_URL = 'https://streamax.zhiye.com/campus/jobs?shareId=9fa03996-78c3-405d-9968-5866042beff8&shareSource=2&qr=1&memory=%7B%7D&silence=1';
  const STREAMAX_TEXT = `锐明技术2027届全球校园招聘正式启动
锐明技术是商用车智能解决方案提供商、A股上市企业，业务涉及高清视频、视觉AI、云计算、大数据及商用车智能化，同时布局L2/L2+高阶智驾、多传感器融合感知等领域。
招聘岗位：研发设计类包括自动驾驶感知、视觉算法工程师、硬件工程师、嵌入式软件开发工程师、产品经理等；同时开放营销类、供应制造类、品牌市场类、职能支撑类岗位。
工作地点：深圳、重庆、成都、东莞等；海外岗位覆盖休斯顿、荷兰、英国、日本、圣保罗等地，具体以所选职位为准。
推荐码：EV3PBJ
推荐投递链接：${STREAMAX_URL}
投递提示：每位同学最多投递3个岗位，志愿为平行志愿；可关注“锐明招聘”公众号获取宣讲会信息；投递时填写推荐码 EV3PBJ。
备用QQ交流群：1121876496。`;
  const TINCI_URL = 'https://wecruit.hotjob.cn/SU62c3ea6b2f9d241e4c8e45ba/mc/position/campus?acotycoCode=bgfmdb&projectId=201701&recruitType=1&isLimitShowPostScope=1';
  const TINCI_TEXT = `天赐材料2027届校园招聘启动
天赐材料（股票代码：002709）成立于2000年6月，拥有46家全资子公司、15家控股子公司，人员规模8300+；锂离子电池电解液市场占有率全球领先，卡波姆产品产能居全球前列。
招聘岗位：技术类、制造类、职能类、销售类。
工作地点：广州、上海、九江、龙南、池州、衢州、溧阳、赣州、宜昌、宜春、清远、西宁、德州、眉山、台州、东莞、江门、福鼎、海外。
福利待遇：五险一金、带薪年假、项目奖金、节日福利、食宿配套、年度体检、股票期权等。
内推链接：${TINCI_URL}
内推码：bgfmdb（填写内推码投递，简历优先筛选）。`;
  const SF_AUTO_URL = 'https://sf-auto1.zhiye.com/campus/jobs';
  const SF_AUTO_TEXT = `电力自动化龙头—四方继保2027届校园招聘—提前批正式开启
四方继保是电力行业主板上市公司，深耕智能电网、智慧配用电、新能源发电及储能业务。
招聘亮点：业内领先薪酬、平台稳定、标准八险一金、全方位福利、丰富培训资源、多工作地可选；毕业生有机会落户北京。
工作地点：北京、武汉、南京、湖州、保定、西安、深圳。
薪酬福利：行业领先薪酬水平、八险一金、交通补贴、餐饮补贴、春节福利假、落户指标、节日礼金、生育礼金等。
投递简历：${SF_AUTO_URL}
推荐码：EVKPJ8。面试流程高效紧凑，具体岗位信息以投递页面为准。`;
  const GUANGMING_TALENT_URL = 'https://mp.weixin.qq.com/s/A9SHzerachOeXkOTxqTpGg';
  const GUANGMING_TALENT_TEXT = `深圳市光明区“百博行·奔光明”（秋季）人才见面会
主办单位：深圳市光明区委组织部、人力资源局。
活动时间：10月11日。上午为职员选聘及求职招聘，下午为光明深度研学参访。
编制岗位：光明区机关事业单位编制职员选聘，共13个编制岗位，涉及区委办公室、发展和改革局、教育局、科技创新局、人力资源局、科学城开发建设署等单位。
企业岗位：光明区重点单位招聘，涵盖深圳理工大学、深圳湾实验室、人工智能与数字经济广东省实验室（深圳）、深圳先进光源研究院等科研院所，以及帝迈生物、欣旺达动力、艾欧智能、杉川机器人等重点企业和博士后站点；30+优质单位、800+岗位。
研学参访：参访光明科学城产业园区、科研院所及重点企业，了解大科学装置、国家超算深圳中心等。
咨询电话：0755-88212064
报名链接：${GUANGMING_TALENT_URL}`;
  const SEPT10_EVENT_DATA = [
    {company:'中国电子科技集团有限公司',title:'2027 届校园招聘双选会',time:'2026-09-10 14:00-17:00',place:'五环广场',audience:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/bilateralchosefairForm.html?id=a97e1589a31a4e69b08f7430c87ebd77&'},
    {company:'顺科智连',title:'2027 届校园秋季招聘宣讲会',time:'2026-09-10 10:00-11:30',place:'招生就业多功能厅',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=2f994c432779456ea0842e03f00a2103&'},
    {company:'招商银行北京分行',title:'“梦想靠岸”2027 秋季校园招聘宣讲会',time:'2026-09-10 17:30-19:00',place:'时代凌宇报告厅',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=650f31b5c95441e5b66fb8d9826222c1&',merge:true,matchCompany:'招商银行'},
    {company:'华为',title:'2027 届校园宣讲会',time:'2026-09-10 19:00-21:00',place:'学术报告厅',audience:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=01dd651719174321a840887364d5d2bb&',merge:true},
    {company:'陕西汽车控股集团有限公司',title:'2027 届秋季校园招聘',time:'2026-09-10 19:00-21:00',place:'时代凌宇报告厅',audience:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=9caa04f9511e45d0a0dc7c0d31cb48b8&'}
  ];
  const HONGWANG_URL = 'https://mp.weixin.qq.com/s/BaCGqw2XRxfwP07XU_oAdg';
  const HONGWANG_TEXT = `宏旺
微信公众号招聘文章：${HONGWANG_URL}`;
  const SMARTLOGIC_URL = 'https://smartlogictech.jobs.feishu.cn/xiaozhao/m/?spread=82A5QW5';
  const SMARTLOGIC_TEXT = `上海思朗科技2027校园招聘正式开启！
上海思朗科技股份有限公司是一家拥有100%自主知识产权MaPU架构的芯片企业，由前中科院自动化所所长王东琳老师创立。
企业亮点：完全自研MaPU架构，具备极致性能与广泛加速能力；拥有成熟软件生态，已在科学计算、5G小基站等领域实现商业化落地。
招聘信息：提供具备竞争力的薪酬待遇、完善的培养体系与多元福利保障；上海、北京、西安、成都、杭州、深圳等多地共40多个岗位选择。
宣讲现场接收纸质简历，并有面试直通卡互动发放。
投递通道：${SMARTLOGIC_URL}`;
  const ZHENGZHOU_CITY_COLLEGE_URL = 'https://mp.weixin.qq.com/s/o3NG3tcRoqefrMmD2GuVCw';
  const XIAMEN_JIAGENG_URL = 'https://mp.weixin.qq.com/s/XiMcGJjlyWlvPwRWuAIm_Q';
  const UNIVERSITY_RECRUITMENT_DATA = [
    {company:'郑州城市职业学院',title:'招聘公告（数字媒体 / 自动化 / 机器人 / 电气 / 车辆 / 财会 / 管理等专业）',url:ZHENGZHOU_CITY_COLLEGE_URL,raw:'郑州城市职业学院招聘公告\n招聘专业：数字媒体技术、自动化、工业机器人、电气工程及自动化、控制科学与工程、车辆工程、新能源汽车技术、智能网联汽车、能源动力、会计、财务管理、工商管理、有机复合材料、教育学、公共管理、经济学、社会学、汉语言文学、新闻传播、影视摄影与制作、工程管理、市场营销、法学、食品检验、酒店管理、新媒体、广告、数字媒体艺术、传播学、新媒体运营等。\n详细招聘公告：' + ZHENGZHOU_CITY_COLLEGE_URL},
    {company:'厦门大学嘉庚学院',title:'2025-2026学年人才招聘启事',url:XIAMEN_JIAGENG_URL,raw:'厦门大学嘉庚学院2025-2026学年人才招聘启事\n招聘学院：人文与传播学院、法学院、英语语言文化学院、设计与创意学院、国际商务学院、会计与金融学院、管理学院、信息科学与技术学院、机电工程与自动化学院、环境科学与工程学院、马克思主义学院、体育教学部、创新创业教育孵化中心、通识教育中心。\n详细招聘公告：' + XIAMEN_JIAGENG_URL}
  ];
  const TORRAS_URL = 'https://lanhevip.jobs.feishu.cn/s/_Y7t3w_Fqho';
  const TORRAS_GROUP_URL = 'https://qr61.cn/oL88tm/qnz9lRO';
  const TORRAS_TEXT = `图拉斯2027届校园招聘正式启动
图拉斯是一家集产品、设计、研发、品牌、营销与大数据于一体的创新型科技公司，全球员工超4500人，业务覆盖148+国家和地区。
工作地点：深圳市龙华区。
推荐岗位：
国内电商运营类（不限专业）：天猫、京东、抖音、拼多多、小红书运营管培生、电商AI训练师。
海外电商运营类（不限专业）：亚马逊运营管培生（英语/日语方向）、TIKTOK运营管培生。
设计类：设计管培生、渲染管培生；产品类：产品储备干部、品类运营专员。
传媒类：抖音主播、小红书主播、拍剪管培生、剪辑师、摄影师；营销类：媒介专员、达播专员、品牌营销专员。
技术工程类：结构工程师、电子工程师、质量工程师；职能类：财务专员、采购专员、计划专员、专利工程师。
27届内推社群：${TORRAS_GROUP_URL}
内推链接：${TORRAS_URL}
内推码：DZJFXUJ`;
  const TAUREN_URL = 'https://m.liepin.com/campus/project-detail/13806389/?mscid=xy_cx_204';
  const TAUREN_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const TAUREN_TEXT = `韬纳英才，润行致远——韬润半导体2027届校园招聘正式启动！
韬润半导体（TAUREN）专注高速互联芯片研发与产业化，已构建覆盖模拟信号链核心点位的产品矩阵，服务通信基础设施、数据中心、新能源汽车等领域。
招聘对象：2027届海内外应届毕业生。
招聘岗位：数字前端设计、算法架构、模拟电路设计、硅光工程、技术销售、投融资管培生等。
工作城市：上海。
投递链接：${TAUREN_URL}
提示：目前较多岗位已开启，注册后当天完成投递，内推处理效率更高。
27秋招交流群：${TAUREN_GROUP_URL}`;
  const PINGAN_LIFE_URL = 'https://m.liepin.com/campus/project-detail/13806384/?mscid=xy_cx_204';
  const PINGAN_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const PINGAN_LIFE_TEXT = `平安人寿2027校园招聘正在进行中
平安人寿成立于2002年，是中国平安保险（集团）股份有限公司旗下重要成员。
招聘对象：2027届应届毕业生。
招聘岗位：产品运营、市场策划、风控、售后技术支持、物流网管、产品经理、算法工程师、人力资源专员/助理等。
工作地点：全国多地，包括阿克苏、阿勒泰、安阳、巴中、白城、白山、白银等，具体以职位页面为准。
投递链接：${PINGAN_LIFE_URL}
投递提示：选择对应岗位投递，当天投递，内推处理效率更高。
27秋招交流群：${PINGAN_GROUP_URL}`;
  const NOVOSNS_URL = 'https://careers.novosns.com/campus';
  const NOVOSNS_TEXT = `纳芯微2027届校招·北京专场宣讲会
纳芯微2013年成立，2022年科创板上市，2025年港股上市，是国内高性能、高可靠性模拟及混合信号芯片企业，数字隔离类芯片、汽车电子芯片领域领先，聚焦传感器、信号链、电源管理三大业务方向。
宣讲亮点：优秀校友分享、业务大咖答疑；宣讲后直接进入面试环节，提前网申同学优先安排面试席位。
招聘方向：芯片设计与研发、产品/系统与应用、技术与客户、制造质量与供应链、职能与组织支持五大方向；海内外多地可选，具体以海报及网申页面为准。
招聘对象：2027届海内外应届毕业生，毕业两年内符合岗位要求者也可投递。
提前网申：${NOVOSNS_URL}
宣讲时间：9月15日（周二）18:00。
宣讲地点：北京中关村皇冠假日酒店3F皇冠宴会厅B。现场提供茶歇、点心和伴手礼包。`;
  const SMIC_URL = 'https://smics.m.zhiye.com/campus.html';
  const SMIC_TEXT = `中芯国际2027届校园招聘进行中
工作地点：上海张江、上海临港、北京、天津、深圳。
招聘专业：电子信息类、集成电路类、材料类、物理类、化学类、光学类、机械类、自动化与控制类、计算机信息技术类、智能制造类、数学类、环境与安全类、管理科学与工程类、管理类等相关专业。
校招职位：技术研发类、电路设计类、工艺工程类、设备管理类、智能制造类、软件算法类、质量管理类、工程支持类、职能支持类等，详见校招官网。
福利：员工宿舍、班车、食堂、补充保险、福利年假、免费体检等。
校招投递链接：${SMIC_URL}
更新资讯请关注公众号“中芯国际微招聘”。`;
  const UISEE_URL = 'https://m.liepin.com/campus/project-detail/13806590/?mscid=xy_cx_202';
  const UISEE_TEXT = `驭势科技2027校园招聘正在进行中
驭势科技2016年成立，专注真无人、全场景L4级自动驾驶技术，是国内率先实现真无人自动驾驶常态化运营的科技企业；截至2026年7月，累计真无人自动驾驶里程超1020万公里。
招聘对象：2027届应届毕业生。
招聘岗位：通信技术工程师、智能网联工程师、嵌入式软件开发、SLAM算法、规控算法、销售经理/主管、运营专员、C++等。
工作地点：北京、重庆、嘉兴、上海、深圳、乌鲁木齐、香港、新加坡。
投递链接：${UISEE_URL}
投递提示：选择对应岗位投递，当天投递，内推处理效率更高。`;
  const JIACHEN_UPDATE_URL = 'https://mp.weixin.qq.com/s/7xj-IoO1BW61_XgaR0wXuw';
  const JIACHEN_UPDATE_TEXT = `现场宣讲：武汉嘉晨电子技术股份有限公司
宣讲时间：9月9日15:30-17:00
宣讲地点：机电信息楼616
宣讲链接：${JIACHEN_UPDATE_URL}
武汉嘉晨电子技术股份有限公司是新能源汽车高压安全系统及核心器件研发制造的国家级高新技术企业。公司成立于2015年，总部位于湖北省武汉市经济技术开发区，在上海、日本名古屋、德国慕尼黑、美国加州设立研发分支机构，并在宁德、宜宾、广州、厦门等地布局生产基地。公司现有员工2000余人，已形成以基础研究、产品研发、应用开发为主线的专家团队。
需求专业：机械、材料、自动化、化学、法学等相关专业。
福利待遇：五险一金、商业险、免费工作餐、超长带薪年假、定期体检、购车优惠、拓展培训、健身房等。`;
  const SHANGHAI_HUALI_URL = 'https://mp.weixin.qq.com/s/qo2b8jACKpxUPkDhq2KDOQ';
  const SHANGHAI_HUALI_TEXT = `上海华力
微信公众号招聘文章：${SHANGHAI_HUALI_URL}`;
  const NEW_ORIENTAL_URL = 'https://t.zhaopin.com/07SfRy';
  const NEW_ORIENTAL_TEXT = `新东方2027届提前批校招火热来袭
新东方是以科技为驱动力的综合性教育集团，业务覆盖素质教育、国际教育、成人教育、智慧教育、直播电商等多个板块。
招聘亮点：岗位提前上新，覆盖全专业求职需求；全国70+城市岗位，可按个人意愿就近安排；提前批专属岗位，抢先锁定优质资源；官方专属答疑。
岗位类别：教师类、运营类、管培类、实习生类等，专业不限，欢迎本硕博同学投递。
薪资福利：行业内具有竞争力的薪资，一岗一议；绩效奖、教师续班奖等奖金；五险一金、六节福利；免费体检、探亲假、生日福利、带薪年假；员工培训、储备干部培训、海外培训。
投递链接：${NEW_ORIENTAL_URL}`;
  const CHANGCHUAN_TEXT = `长川科技2027届校园招聘简章
杭州长川科技股份有限公司（股票代码：300604）成立于2008年，是半导体专用设备企业，2017年在深交所创业板上市。公司总部位于杭州，业务和团队覆盖杭州、成都、哈尔滨、武汉、上海、内江、常州、北京、苏州、南京等地。
招聘对象：2027届全日制应届毕业生，本科及以上学历；机械、电气、自动化、光学、计算机、软件、电子信息、印刷、包装等相关专业可投。
招聘流程：网申→简历筛选→AI笔面试（部分岗位）→业务面→综合面→录用审批→Offer→签约。
主要招聘方向及岗位：
硬件类：数字/模拟硬件工程师、射频工程师、FPGA工程师、电气工程师、器件工程师、光学工程师、光学高级工程师、Layout工程师。
软件与算法类：驱动工程师、软件工程师、前端软件工程师、自动化软件工程师、视觉软件工程师、深度学习算法工程师、控制算法工程师（电机方向）。
机械与能源类：机械工程师、制冷工程师、热设计工程师、传热工程师、FEA工程师及高级岗位。
仿真与材料类：SI仿真、EMC仿真、CFD、材料工程师及高级岗位。
AI类：AI基础设施工程师、AI开发工程师、AI仿真工程师、AI应用开发高级工程师。
测试与应用类：硬件测试、软件测试、整机测试、测试认证、应用开发（数字/模拟）、视觉应用开发、系统高级工程师。
产品及支持类：产品工程师、机械产品工程师、产品运营工程师、研发质量、应用开发质量、项目管理、桌面运维、售后服务、销售支持。
供应链、制造及职能类：IQC、工艺、采购、计划、生产技术、PCB维修、调试、物控、成品检验、库房、物流、人力资源、财务BP等。
薪酬福利：基本工资、绩效工资、补贴及其他奖励；年终奖上不封顶，年度调薪；五险一金、免费工作餐/餐补、年度体检、带薪休假、节假日福利、高温补贴、商业保险等。
简历邮箱：changchuanhr10@hzcctech.cn
投递提示：请关注“长川科技招聘”微信公众号，通过招聘简章二维码投递；本 PDF 未提供可复制的网申 URL。`;
  const TAVERN_TEXT = `麦吉太文Magic Tavern「2027届秋季校园招聘」正式启动！
Magic Tavern是一家全球化的游戏研发和发行公司，总用户过亿，月活跃玩家逾千万。
招聘对象：2027届海内外高校应届毕业生
招聘岗位：策划、市场、程序、数据分析、美术；工作地点：北京；专属推荐码：DSjv4BgA
投递简历：${TAVERN_URL}`;
  const LUSTER_TEXT = `凌云光 2027 届校园招聘开始啦！
公司简介：凌云光（股票代码：688400），科创板上市企业，中国机器视觉行业销售额 Top1。专注机器视觉 + 光学技术，为机器植入眼睛和大脑，服务消费电子、新能源、半导体、汽车电子等高端制造领域。
热招岗位：研究类（算法&光学博士）、算法类、软件类、光学类、自动化类、硬件、测试类、供应链类、营销项目类、技术支持类、海外管培生
招聘专业：计算机、软件工程、人工智能、自动化、光学工程、光电信息、电子信息、机械工程、电气工程、数学、物理、工业工程、物流管理、国际贸易等相关专业，理工科优先
工作地点：苏州、北京、上海、深圳、西安、合肥、武汉、成都，越南、马来西亚、新加坡
投递简历：${LUSTER_URL}`;
  const CCTC_TEXT = `🚀 三环集团2027届秋招，正式启动！
还在等“金九银十”？赶紧先投简历先拿offer👇
✅ 岗位管够：研发/机电/技术支持/职能，四大类岗位全开！
✅ 地点自由：潮州、深圳、成都、德阳、南充、苏州，甚至泰国春武里！
✅ 福利实在：员工公寓、员工餐厅、五险一金、带薪年假，还有集体婚礼！
💻 PC端：hr.cctc.cc
📱 手机端：关注【CCTC三环招聘】公众号
⏰ 好岗位不等人，简历投起来，我们面试见！
${CCTC_WECHAT_URL}`;
  const HELLOTECH_TEXT = `绿能星计划—华宝新能2027全球校园招聘正式启动！
总部深圳，布局硅谷、东京、杜塞尔多夫、墨尔本。2022年9月于创业板上市，从“便携储能第一股”跃升为全场景家庭绿电开创者，正加速迈向全球消费级光储引领者。
招聘岗位：研发管培生、营销管培生、供应链管培生；薪酬福利：行业内部具竞争力的起薪、3年快节奏晋升调薪机制、多层次评级激励、多元化专项奖金、年度经营结果分享奖金
登录链接：${HELLOTECH_URL}
填写学校专属推荐码：EVBMRS 投递（简历优先筛选）`;
  const HELLOTECH_UPDATED_TEXT = `华宝新能2027全球校园招聘正式启动！！
华宝新能成立于2011年，2022年在中国创业板挂牌上市，成为“便携储能第一股”，致力于SG光充户外电源、DIY小型家庭绿电系统和XBC光伏瓦家庭绿电系统等新品类的研发、生产和销售，产品服务覆盖50多个国家和地区。
招聘对象：2027届海内外应届毕业生。
招聘岗位：研发管培生（轮岗范围：预研、产品、硬件、嵌入式、结构、IoT）；营销管培生（轮岗范围：品牌、营销、运营、渠道）；供应链管培生（轮岗范围：采购、计划、物流、品质、工艺、制造）。
工作地点：深圳、加利福尼亚、东京、首尔、杜塞尔多夫。
薪酬福利：高起薪、快节奏调薪、住房补贴/人才房、宵夜补贴、落户等。
内推投递通道：${HELLOTECH_UPDATED_URL}
内推码：ES3MTR（内推投递，简历筛选快人一步）。
秋招交流群：${HELLOTECH_GROUP_URL}
2027届校招内推信息集合：${HELLOTECH_COLLECTION_URL}`;
  const HELLOTECH_RECOMMEND_UPDATE_TEXT = `华宝新能绿能星计划2027全球校园招聘最新补充
招聘岗位：研发管培生、营销管培生、供应链管培生。
薪酬福利：行业内部具竞争力的起薪、3年快节奏晋升调薪机制、多层次评级激励、多元化专项奖金、年度经营结果分享奖金。
登录链接：${HELLOTECH_URL}
学校专属推荐码：ESKPKJ。`;
  const CHANGSHA_MINING_URL = 'https://mp.weixin.qq.com/s/HRje8GwrmrH7lm9iXHBL7A';
  const CHANGSHA_MINING_TEXT = `长沙矿冶院
微信公众号文章：${CHANGSHA_MINING_URL}`;
  const SANKE_TREE_URL = 'https://actyco.wintalent.cn/actyco/home/receiver/poster/redirect?id=2ce781f59fb8433201a085fdb24a22d9';
  const SANKE_TREE_TEXT = `三棵树2027届校园招聘正式启动！
民族涂料第一品牌，全球涂料上市公司市值10强。
关于我们：2002年成立，A股主板上市，员工人数10000+；中国民营企业500强，建筑涂料中国第一品牌；全国4大中心、14大生产基地、6大研发平台；连续多年蝉联中国年度最佳雇主。
岗位类别：技术应用类、营销业务类、供应链类、技术研发类、财务岗、信息岗、职能岗、博士类。
工作地点：北京、上海、成都、滁州、贺州、莆田、孝感。
投递方式：关注三棵树公众号，选择“应届生招聘”，点击“招聘岗位”进行投递；一键投递链接：${SANKE_TREE_URL}
内推码：gczodo。详情请以海报/简章附件为准。`;
  const LIYANG_URL = 'http://campus.51job.com/liyang/';
  const LIYANG_FAIR_URL = 'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=d66dcbb46c4445339d1a321e250898bb&';
  const IOPT_FAIR_URL = 'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=cf2682b90a7e40f1a085521b2aa17268&';
  const LIYANG_TEXT = `【现场宣讲】中国航发黎阳
宣讲时间：2026-09-12 13:30
宣讲地点：时代凌宇报告厅
单位网申链接：${LIYANG_URL}
中国航发贵州黎阳航空动力有限公司1965年成立，隶属于中国航空发动机集团有限公司，位于贵州省贵阳市，致力于建成世界一流中小推力航空发动机总承企业。
需求专业：先进涂层技术、先进机械加工技术、机械工程、飞行器动力工程、能源与动力工程、工业工程、计算机科学与技术、人力资源管理、财务管理等相关专业，详见投递链接。
福利待遇：五险二金、购房免息贷、安家费、就餐补贴、交通补贴、保密补贴、职工宿舍、健康体检、物资福利、带薪休假、探亲假等。`;
  const LIYANG_FAIR_TEXT = `中国航发黎阳2027届秋季校园招聘
举办时间：2026-09-12 13:30～15:00
举办地点：时代凌宇报告厅
面向学生层次：本科、硕士、博士
详细信息：${LIYANG_FAIR_URL}`;
  const IOPT_FAIR_TEXT = `中国科学院光电技术研究所2027年秋季校园招聘
举办时间：2026-09-12 15:30～17:00
举办地点：时代凌宇报告厅
面向学生层次：硕士、博士
详细信息：${IOPT_FAIR_URL}`;
  const SUZHOU_FAIR_URL = 'https://job.ustb.edu.cn/frontpage/ustb/html/bilateralchosefairForm.html?id=da671b9ef39941e7be3dc1a1b61309ca&';
  const SUZHOU_FAIR_TEXT = `苏州双选会
详细信息：${SUZHOU_FAIR_URL}`;
  const SEPT14_FAIR_ITEMS = [
    {company:'苏州市吴江区',title:'2026年秋季校园招聘活动（走进北京科技大学）',city:'苏州吴江',time:'2026-09-14 09:30-11:30',venue:'教职工礼堂',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/bilateralchosefairForm.html?id=da671b9ef39941e7be3dc1a1b61309ca&',merge:'suzhou'},
    {company:'中冶京诚',title:'“京彩启航 诚就不凡”2027年校园招聘',city:'北京（宣讲会）',time:'2026-09-14 14:30-17:00',venue:'教职工礼堂',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/bilateralchosefairForm.html?id=c8ef777c973142af8c0eccb3cf498b73&'},
    {company:'中建三局第一建设工程有限责任公司',title:'2027届校园招聘',city:'北京（宣讲会）',time:'2026-09-14 13:30-15:00',venue:'招生就业多功能厅',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=b30002c060604bd0af34b207cce0b38a&'},
    {company:'特变电工沈阳变压器集团有限公司',title:'2027届校园招聘',city:'北京（宣讲会）',time:'2026-09-14 13:30-15:00',venue:'时代凌宇报告厅',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=fb86a51ca0f44895b0506702b938e596&'},
    {company:'融科联创',title:'“算力觉醒·校园计划”2027届校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-14 15:30-17:00',venue:'逸夫楼207',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=a91989459e25434aa102ee410b8ddaca&'},
    {company:'中信重工',title:'2027年校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-14 15:30-17:00',venue:'逸夫楼706',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=b5067e4ebad3480ba75c55fe54c4ac59&'},
    {company:'燕东微',title:'2027全球校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-14 15:30-17:00',venue:'时代凌宇报告厅',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=c1ff1f1a8b5b4952a663fac4a6b9e12d&'},
    {company:'库犸科技',title:'2027校园招聘线下宣讲会（北京科技大学站）',city:'北京（宣讲会）',time:'2026-09-14 17:30-19:00',venue:'招生就业多功能厅',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=4c113952491a4262bcaf2d549605331b&'},
    {company:'上海华力',title:'2027届校园招聘',city:'北京（宣讲会）',time:'2026-09-14 19:00-21:00',venue:'机电信息楼106',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=62e07ed0d75346f0b8cb33178c40149f&',merge:'huali'},
    {company:'柳工机械',title:'“与柳工·拓世界·共成长”2027届秋季校园招聘',city:'北京（宣讲会）',time:'2026-09-14 19:00-21:00',venue:'时代凌宇报告厅',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=75bcbde5e3c2440d95df306e4a955915&'},
    {company:'潍柴雷沃智慧农业',title:'2027全球校园招聘',city:'北京（宣讲会）',time:'2026-09-14 19:00-21:00',venue:'逸夫楼601',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=fb454c23b2e045e7a46cefd0c2e60b97&'}
  ];
  const SEPT15_FAIR_ITEMS = [
    {company:'中国机械科学研究总院',title:'2027届校园招聘',city:'北京（双选会）',time:'2026-09-15 14:00-17:00',venue:'教职工礼堂',levels:'',url:'https://job.ustb.edu.cn/frontpage/ustb/html/bilateralchosefairForm.html?id=61e15bedfaa0473ab7456f8bd43ce98f&'},
    {company:'中国核工业二四建设有限公司',title:'中核集团2027届校园招聘',city:'北京（宣讲会）',time:'2026-09-15 13:30-15:00',venue:'逸夫楼102',levels:'本科、硕士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=4629aec5580047b8ad13a363a41be83f&'},
    {company:'无锡派克新材料科技股份有限公司',title:'2027届校园招聘',city:'北京（宣讲会）',time:'2026-09-15 13:30-15:00',venue:'时代凌宇报告厅',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=cb1f669516e44b1685c9fc996e1fa101&'},
    {company:'同方数科',title:'2027届秋季校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-15 15:30-17:00',venue:'逸夫楼302',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=13c1e60f411e4458b9d8f4183d6f8c11&',tags:['AI/Agent']},
    {company:'三环集团',title:'2027届秋季校园招聘',city:'北京（宣讲会）',time:'2026-09-15 15:30-17:00',venue:'逸夫楼701',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=1c729295ac0b49ec975a7e7692d7976e&',merge:'cctc'},
    {company:'科华集团',title:'2027届校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-15 15:30-17:00',venue:'招生就业多功能厅',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=7ed95a24658740cdaa3501cc4576b43e&',merge:'kehua-group'},
    {company:'中芯国际',title:'2027届校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-15 15:30-17:00',venue:'时代凌宇报告厅',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=8e9e51e343734e16868c70806f271cd7&',merge:'smic'},
    {company:'深南电路',title:'27届校园宣讲会',city:'北京（宣讲会）',time:'2026-09-15 17:30-19:00',venue:'时代凌宇报告厅',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=60f21002c75a4e53b2984662fdbd967a&',merge:'scc'},
    {company:'山东核电有限公司',title:'2026年秋季招聘',city:'北京（宣讲会）',time:'2026-09-15 19:00-21:00',venue:'逸夫楼601',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=067d74deebd04bf7bb697513dfb755e8&'},
    {company:'新东方',title:'2027全球联合校园招聘',city:'北京（宣讲会）',time:'2026-09-15 19:00-21:00',venue:'逸夫楼604',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=5be97b3bcdf6420fb145df8a69640d31&',merge:'new-oriental'},
    {company:'杰瑞集团',title:'“大国重器·上市公司”2027届校园招聘',city:'北京（宣讲会）',time:'2026-09-15 19:00-21:00',venue:'时代凌宇报告厅',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=7b509983f4bb477eaeecb1b769c85279&'},
    {company:'用友',title:'“企业级AI：新赛道、新引擎、新未来”2027届校招空中宣讲会',city:'线上',time:'2026-09-15 19:00-20:00',venue:'线上',levels:'本科、硕士、博士',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=c5e0e0316e92485da07179b5083973e5&',extraUrl:'https://www.nowcoder.com/live/detail?liveId=574',tags:['AI/Agent']}
  ];
  const SPACE_T1_URL = 'https://app.mokahr.com/campus-recruitment/space-t1/67916';
  const SPACE_T1_DOC_URL = 'https://docs.qq.com/doc/DTUN5TkpuV09abnRZ';
  const SPACE_T1_TEXT = `芯途奋进，迭启新程｜进迭时空2027届校园招聘正式启动
进迭时空成立于2021年，立足RISC-V架构，专注下一代AI CPU芯片研发与产业化，产品覆盖终端及云端服务器AI CPU芯片，在北京、杭州、上海、深圳、珠海等地设有办公室。
校招岗位方向：AI编译器、AI推理引擎、AI高性能计算、编译器开发、CPU设计/验证/软件/后端物理实现、SoC设计/验证、芯片DFT、封装、硅后验证、硬件设计、产品测试、AI应用、AI具身应用、AI agent BD、RISC-V技术生态运营、Linux内核、OS系统软件、Web后端、销售管培、科研运营、财务、人力资源等。
工作地点：北京、杭州、上海、珠海、深圳。
福利待遇：本科25-35W；硕士35-50W；六险一金、福利计划、补贴、弹性工作时间。
投递链接：${SPACE_T1_URL}
推荐码：NTA8TSe
招聘简章：${SPACE_T1_DOC_URL}`;
  const EASPRING_URL = 'https://mp.weixin.qq.com/s/Q1MmQyHgiCD32l2NxU1Rmw';
  const EASPRING_TEXT = `央企新能源当升科技2027届校园招聘
宣讲时间：2026年9月17日19:00
宣讲地点：逸夫楼601
主要岗位：研发类、工艺质量类、设备自动化类、销售职能类、生产现场类、检测类等。
重点专业：材料类、化学类、化工类、新能源类、冶金类、机械自动化类、财务管理类等，本科、硕士、博士均欢迎。
宣讲现场抽取直通面试卡。
公司福利：一级央企下属、行业龙头、北京户口；工程师年薪15-35W；技术+管理双通道；国际化发展背景及在职读博机会；六险二金及多重补贴。
更多详情：${EASPRING_URL}`;
  const CNNC_ZHONGYUAN_ARTICLE_URL = 'https://mp.weixin.qq.com/s/qieOYQoanU6O63PXSqUmcg';
  const CNNC_ZHONGYUAN_URL = 'https://cnnc.zhiye.com/custom/campus?hideMenu=1&c1=162';
  const CNNC_ZHONGYUAN_TEXT = `青春启航 筑梦中原｜中核集团中国中原对外工程有限公司2027届校招
中国中原引领中国核能走向世界。
专业需求：核工程、机械、焊接、电气、仪控、自动化、材料、能源动力、土木工程、岩土工程、结构工程、安全管理、环境工程、俄语、情报学、档案学、信息资源管理、图书馆学、计算机等相关专业。
薪酬福利：具有市场竞争力的薪酬和福利待遇、系统的培训体系、多通道的晋升机制。
工作地点：北京、上海、海外。
详情：${CNNC_ZHONGYUAN_ARTICLE_URL}
简历投递：${CNNC_ZHONGYUAN_URL}`;
  const THIRTY_SEVEN_SIGNUP_URL = 'https://wj.qq.com/s2/27529313/btp9/';
  const THIRTY_SEVEN_CAMPUS_URL = 'https://app.mokahr.com/m/campus-recruitment/37/58016?locale=zh-CN';
  const THIRTY_SEVEN_TEXT = `Offer来啦！三七互娱北京线下面试专场
三七互娱是A股上市游戏大厂（002555），旗下《Puzzles & Survival》《斗罗大陆》《寻道大千》等游戏长期运营，全球月活超1.6亿。
现场面试岗位：游戏系统策划、游戏数值策划、海外游戏运营、海外广告优化师、Unity客户端游戏开发工程师。
时间地点：9月17日（周四）北大博雅国际酒店；9月18日（周五）北京中关村人民大学桔子水晶酒店。
形式：现场1V1面试，大部分岗位现场终面，最快当天发Offer。
线下面试专场报名：${THIRTY_SEVEN_SIGNUP_URL}
网申入口：${THIRTY_SEVEN_CAMPUS_URL}`;
  const HOYMILE_UPDATED_TEXT = `同豪迈，共未来｜豪迈2027届秋季校园招聘北京科技大学专场
宣讲时间：9月18日19:00
宣讲地点：北京科技大学逸夫楼206
校招岗位：机械类、电气类、自动化类、材料类、化工类、能动类、土木类、计算机类、外语类、文法类等；海报显示有30个热门岗位方向。
工作地点：潍坊高密、莒县、坊子、山东青岛、威海、日照、江苏启东等。
薪资福利：本科15-17W；硕士18-25W；高配置宿舍、品质餐厅、入职培训、一对一专属导师。
海报二维码用于获取更多信息和投递简历，当前未提供可复制的投递 URL。`;
  const GEELY_URL = 'https://m.liepin.com/company/911622/?mscid=xy_cx_202';
  const GEELY_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const GEELY_TEXT = `浙江吉利控股集团有限公司2027届秋招
吉利控股集团以汽车产业为核心，业务涵盖汽车及上下游产业链、智能出行服务和数字科技，推进电动化与智能化发展。
招聘对象：2027届应届毕业生。
招聘岗位：法律事务岗、汽车动力研发项目管理岗（日语）、客户质量岗、新品质量管理岗、管培、汽车动力研发工程师、新能源标定工程师（DCT方向）等。
工作地点：杭州、宁波、无锡、衢州。
投递链接：${GEELY_URL}
27届招聘交流群：${GEELY_GROUP_URL}`;
  const PINGAN_PENSION_URL = 'https://m.liepin.com/company/7996989/?mscid=xy_cx_208';
  const PINGAN_PENSION_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const PINGAN_PENSION_TEXT = `平安养老保险股份有限公司2027届秋招
平安养老是中国平安旗下的专业养老保险公司，围绕企业年金及养老保障等需求开展相关业务。
招聘对象：2027届应届毕业生。
招聘岗位：企业年金基金业务管培生、AI算法工程师、固收交易岗、投资核算岗、系统开发工程师、固收研究岗等。
工作地点：北京、上海、广州、深圳、成都等。
投递链接：${PINGAN_PENSION_URL}
27届校招交流群：${PINGAN_PENSION_GROUP_URL}`;
  const PINGAN_BANK_URL = 'https://hm.wshotoai.cn/d/ahm62b';
  const PINGAN_BANK_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const PINGAN_BANK_TEXT = `平安银行27届秋招正式批
平安银行是全国性股份制商业银行，也是中国平安综合金融体系的重要组成部分。
招聘对象：2027届毕业生。
投递链接：${PINGAN_BANK_URL}
27秋招交流群：${PINGAN_BANK_GROUP_URL}
说明：投递短链接提示需添加微信并回复“平安银行”获取投递信息；交流群需在微信或企业微信中打开。`;
  const CRRC_GROUP_URL = 'https://crrc.hotjob.cn/';
  const CRRC_GROUP_TEXT = `中国中车集团2027全球校园招聘北京城市专场
时间：9月19日14:00
地址：北京市海淀区东升科技园北街6号院8号楼院内。
中国中车集团将带领40多家分、子公司到现场招聘，现场提供专车接送、伴手礼和抽奖活动。
北京招聘群：北京1群821388838；北京2群1070681478；北京3群1065115793。
中国中车招聘官网：${CRRC_GROUP_URL}`;
  const HAIYI_SOFTWARE_URL = 'https://www.liepin.com/campus/project-detail/13806460/?mscid=lb_wh_06';
  const HAIYI_SOFTWARE_TEXT = `海颐软件2027届校园招聘正式启动
烟台海颐软件股份有限公司成立于2003年，总部位于烟台，是上市公司东方电子控股子公司，聚焦电力能源行业数智化服务，践行“AI+”“交易+”“双碳+”战略，业务覆盖全国30多个省（区、市）。
招聘对象：2027届博士、硕士、本科应届毕业生；实习生岗位同步开放，欢迎2028届同学提前参与真实电力AI场景。
专业方向：计算机科学与技术、人工智能、电力能源、自动化、数学、电子信息等。
招聘岗位：AI算法类（机器视觉、优化决策、时序预测、大模型应用架构）；业务咨询类（电力交易、智碳研究、咨询顾问、硬件产品经理、电力能源销售）；研发工程类（边缘实时控制/嵌入式、FDE、AI应用全栈、全栈开发、实施工程师）。
工作地点：北京、南京、广州、烟台、济南、武汉、上海、西安、澳门、深圳、昆明等。
薪酬福利：竞争力薪资、年终奖金、项目补贴、绩效奖金、年度调薪、电脑/住宿/高温取暖/交通/误餐补贴、12天以上带薪年假、年度体检、免费午餐等。
投递通道：${HAIYI_SOFTWARE_URL}`;
  const FOTILE_URL = 'https://neitui.italent.cn/fotilehr/sharejobs?shareId=7386ed95-aac8-4646-a041-6f8792f32410&language=zh_CN&rt=2';
  const FOTILE_GROUP_URL = 'https://docs.qq.com/doc/DUHJjeHpLUHNFYnRI';
  const FOTILE_COLLECTION_URL = 'https://docs.qq.com/smartsheet/DUEFqWGN2bWN1WnRS';
  const FOTILE_TEXT = `方太集团27届秋招内推启动！
公司成立于1996年，以智能厨电为核心业务，全球拥有16000+名员工。
工作地点：宁波慈溪杭州湾国家级经济开发区。
工作时间：855，不加班。
薪酬福利：七险一金、14-16薪、公积金双边各8%、入职两年有身股分红、年调薪幅度12-16%；购房前免费住宿，实习工资全额发放，并有多项补贴和福利。
招聘岗位：产品研发类（具身智能算法、大模型算法、图像识别算法、交互设计、电子电气）；销售服务类；供应链类（智能制造、品质、采购）；品牌营销类；行政综合类（中医研发工程师）；柏厨事业部销售设计/研发设计。
内推链接：${FOTILE_URL}
员工内推码：E113515
秋招交流群：${FOTILE_GROUP_URL}
2027届校招内推信息集合：${FOTILE_COLLECTION_URL}`;
  const HONGGONG_URL = 'https://wecruit.hotjob.cn/SU68197fa81c240e07d7836b7b/mc/position/campus?acotycoCode=qrkqgs&recruitType=1&isLimitShowPostScope=0';
  const HONGGONG_QA_URL = 'https://docs.qq.com/doc/DRkxIU3ZjZ1FUcFBm';
  const HONGGONG_TEXT = `宏工科技27届校园招聘启动！
宏工科技（证券代码：301662）成立于2008年，聚焦物料处理和工业自动化领域，是国内领先的物料处理自动化综合服务商。
岗位类别：研发技术类、供应交付类（专业不限）、市场战略类（专业不限）、职能运营类。
薪酬福利：本科11-16万；硕士16-25万；博士一人一议；每年1-2次调薪，提供食宿、无息借款、互助基金、节日礼品、带薪年假、年度旅游、免费体检等。
人才发展：专项人才培养计划、导师制、多职级多方向职业发展体系。
工作地点：长沙、株洲、无锡。
招聘答疑：${HONGGONG_QA_URL}
移动端内推链接：${HONGGONG_URL}
内推码：qrkqgs（内推投递，简历优先筛选，面试流程加快）。`;
  const GOODWE_URL = 'https://wecruit.hotjob.cn/SU630a3a1f2f9d2406b4f6c5f7/mc/position/campus?acotycoCode=ymezfz&projectId=200701&recruitType=1&isLimitShowPostScope=1';
  const GOODWE_TEXT = `固德威27届秋季校招启动！
固德威（股票代码：688390）是全球逆变器Top10、连续9年苏州最佳雇主，产品与服务覆盖全球100多个国家和地区，在全球设有12个海外子公司和30个销售与服务中心；全球拥有8000+名员工，并在苏州、南京、武汉、深圳、顺德设立5大研发中心。
岗位类别：研发类、职能类、营销类、技术服务类、制造技术类。
工作地点：苏州、武汉、深圳、安徽广德、佛山顺德。
内推链接：${GOODWE_URL}
内推码：ymezfz（简历优先筛选，流程加速）。`;
  const SHANGHAI_POWER_INSTALL_URL = 'http://bjxapp.cn/t/NjM0ODAwMQ/';
  const SHANGHAI_POWER_INSTALL_TEXT = `上海电力安装第二工程有限公司（国有企业）
企业简介：上海电力安装第二工程有限公司始建于1953年，隶属世界500强企业中国电建，是国家电力工程施工总承包壹级资质企业，主要从事火力发电设备安装、机电设备安装、市政工程施工、核电、风电、垃圾电厂、钢结构、非标设备和热力、汽水管道制作安装、电气装置、变电所、采暖通风设备以及起重设备安装施工等业务。
招聘对象：2027届应届毕业生。
招聘岗位：电气技术员、金属焊接工程师、热动技术员。
专业需求：电气工程及其自动化、自动化、能源与动力工程、新能源科学与工程、机电一体化、土木工程、工程管理、工程造价、工商管理、法学、审计、金属材料、材料成型及焊接、安全工程、工程造价、工程测绘等相关专业应届生。
投递方式：手机端网申入口 ${SHANGHAI_POWER_INSTALL_URL}；也可扫描招聘简章中的二维码投递简历或进群获取更多信息。
说明：简章未列明具体薪资和工作地点；附件中另有中国电建小程序投递二维码和微信群二维码。`;
  const JATEN_TEXT = `嘉腾机器人2027届校园招聘
嘉腾机器人（JATEN）成立于2002年，2005年启动自动搬运车（AGV）研发，2008年开展自主移动机器人（AMR）研究，2012年启动无人叉车研发。公司聚焦具身智能和移动机器人产业，围绕iCORE智能基座及具身智能技术开展工业场景应用。
招聘岗位：
1. 算法类｜高级工程师（人形/具身智能）｜需求2人｜计算机、软件、自动化、AI、机器人等｜30-50万元/年
2. 算法类｜储备算法工程师（大模型、SLAM、视觉、运动控制、机械臂、电机）｜需求20人｜计算机、软件、自动化、AI、机器人等｜18-50万元/年
3. 软件类｜储备软件工程师｜需求10人｜计算机、软件、自动化、AI、机器人等｜12-45万元/年
4. 测试类｜储备测试工程师｜需求10人｜电子、自动化、机电等｜12-45万元/年
5. 机械类｜储备机械工程师｜需求6人｜机械、车辆、机器人等｜12-45万元/年
6. 电气类｜储备电气工程师｜需求6人｜电气、自动化、机电等｜12-45万元/年
7. 项目类｜技术应用工程师｜需求6人｜电气、自动化、机电、机械、机器人等｜12-45万元/年
8. 方案类｜储备方案工程师｜需求10人｜物流工程、工业工程、机械类｜12-45万元/年
9. 销售类｜销售管培生｜需求6人｜营销类、工科类｜12-45万元/年
10. 管理类｜综合管培生｜需求6人｜管理类、工科类｜12-45万元/年
福利待遇：具身智能赛道机会、竞争力薪酬、多元奖金激励、导师带教、年度调薪、全球业务布局和海外项目历练、完善五险一金、食宿班车保障、五天八小时制、工作生活平衡。
说明：图片包含HR微信和公众号二维码，未提供可复制的投递链接；统一工作地点未在海报中注明，以具体岗位页面或HR通知为准。`;
  const SUNSHINE_INSURANCE_URL = 'https://m.liepin.com/company/684604/?mscid=xy_cx_202';
  const SUNSHINE_INSURANCE_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const SUNSHINE_INSURANCE_TEXT = `阳光保险集团股份有限公司2027届秋招
公司简介：阳光保险通过旗下保险及资产管理业务，为客户提供人寿、健康、财产保险等风险保障和相关服务。
招聘对象：2027届应届毕业生。
招聘岗位：集团运营风控方向雏鹰管培生、产险湖北农险方向雏鹰管培生、集团法务方向雏鹰管培生、阳光产险管培生、产险智能应用研发岗科技培训生、集团精算（寿险）方向雏鹰管培生、配置组合与企划部配置管理岗等。
工作地点：北京、武汉、绵阳。
投递链接：${SUNSHINE_INSURANCE_URL}
招聘交流群：${SUNSHINE_INSURANCE_GROUP_URL}。`;
  const TOUTIAO_URL = 'https://m.liepin.com/company/7863078/?mscid=xy_cx_208';
  const TOUTIAO_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const TOUTIAO_TEXT = `北京今日头条科技有限公司2027届秋招
公司简介：字节跳动以技术支持内容创作与信息传播，旗下产品涵盖今日头条、抖音、飞书、剪映等内容及协作场景。
招聘对象：2027届应届毕业生。
招聘岗位：商家BD-万葭灯火（抖音生活服务旗下品牌）、人力运营专家、平台产品经理-抖音生活服务、网络开发工程师-AI算力基础设施、招聘运营、AI量子化学研究员、面向大模型与AI Agent的云原生开发等。
工作地点：北京、上海、深圳、成都、杭州等。
投递链接：${TOUTIAO_URL}
招聘交流群：${TOUTIAO_GROUP_URL}。`;
  const SERES_URL = 'https://sokon.zhiye.com/campus/jobs';
  const SERES_AIVA_URL = 'https://aiva.zhiye.com/';
  const SERES_UPDATE_TEXT = `赛力斯集团2027届全球校园招聘-北京科技大学
宣讲时间：9月16日17:30。
宣讲地点：时代凌宇报告厅。
关于赛力斯：全球第4家盈利的新能源车企，代表车型包括问界系列M9、M8、M7、M6；A股+H股上市企业、中国企业500强、重庆民营企业TOP1。
职位需求：研发类、智造类、质量类、供应链类、销服类、职能支持类。
工作地点：重庆、上海、成都。
员工福利：六险一金、免费交通车、免费工作餐、免费住宿、节日礼品、生日礼品，以及入职礼包、入职交通补贴、入职体检补贴、入职安家补贴、1年新手保护期等应届生专属福利。
赛力斯集团投递链接：${SERES_URL}
赛豆科技投递链接：${SERES_AIVA_URL}
宣讲会现场可投递简历，并有业务专家一对一简单面试和咨询。`;
  const SEPT16_FAIR_ITEMS = [
    {company:'中国有研科技集团有限公司',title:'2027届北京科技大学专场双选会',city:'北京（双选会）',time:'2026-09-16 09:30-11:30',venue:'教职工礼堂',kind:'双选会',url:'https://job.ustb.edu.cn/frontpage/ustb/html/bilateralchosefairForm.html?id=72d25a4d2fd349a2afcb018d9ad1bed6&'},
    {company:'“百万英才汇南粤”N城联动秋季招聘活动',title:'2026年N城联动秋季招聘活动（北京科技大学专场）',city:'北京（双选会）',time:'2026-09-16 14:00-17:00',venue:'五环广场',kind:'双选会',url:'https://job.ustb.edu.cn/frontpage/ustb/html/bilateralchosefairForm.html?id=240053f6ca2f4bc98ebe62d4f1abc9b8&'},
    {company:'中建三局钢构科技有限公司（科创公司）',title:'2027校园招聘',city:'北京（宣讲会）',time:'2026-09-16 13:30-15:00',venue:'招生就业多功能厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=75c7dcccd14b4b168b1f1e745b293574&'},
    {company:'江苏博睿光电股份有限公司',title:'2027届专场招聘',city:'北京（宣讲会）',time:'2026-09-16 13:30-15:00',venue:'教学楼203',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=ae581eb6bdb4431aa2608bcf2acce606&'},
    {company:'四方股份',title:'“青春当燃，志在四方”2027届全球校园招聘',city:'北京（宣讲会）',time:'2026-09-16 13:30-15:00',venue:'逸夫楼707',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=e14f7a5082c846de9750aa0cfec9e3e5&',merge:'sf'},
    {company:'湖南华菱涟源钢铁集团',title:'秋季招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-16 15:30-17:00',venue:'冶金楼616安耐克报告厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=74b435b2af4d4701b80399f2ad7cc57e&'},
    {company:'五矿集团国创公司、长沙矿山研究院有限责任公司',title:'2027届校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-16 15:30-17:00',venue:'时代凌宇报告厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=af629b38e00c48bab1ee338353fa7a76&',merge:'changsha-mining'},
    {company:'中车大同电力机车有限公司',title:'2027届校园招聘简章宣讲会',city:'北京（宣讲会）',time:'2026-09-16 15:30-17:00',venue:'招生就业多功能厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=e0b6605943034f16b1fbc96205516204&'},
    {company:'桃李未来',title:'“在桃李，见未来”2027届秋季校园招聘',city:'线上',time:'2026-09-16 16:00-17:00',venue:'线上',url:'https://live.bilibili.com/3356592'},
    {company:'中国石油塔里木油田分公司',title:'2026年秋季高校毕业生招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-16 17:30-19:00',venue:'招生就业多功能厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=045a94f427e546aba88fb0e06a29c2de&'},
    {company:'赛力斯集团',title:'2027届校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-16 17:30-19:00',venue:'时代凌宇报告厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=0483a65e2be44ee6b39ecaf6a97c0f20&'},
    {company:'中国科学院东莞材料科学与技术研究所',title:'2027届校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-16 19:00-21:00',venue:'逸夫楼607',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=474cd9101fa7425f9be8da9972b8c1e5&'},
    {company:'中科曙光',title:'2027届秋季校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-16 19:00-21:00',venue:'逸夫楼706',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=5d7e87a0b2c54068bc168c42c698dad1&',merge:'sugon'},
    {company:'贵州航宇科技发展股份有限公司',title:'2027届校园宣讲',city:'北京（宣讲会）',time:'2026-09-16 19:00-21:00',venue:'逸夫楼705',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=74e9672c5951420690489e7563d01a88&'},
    {company:'洛阳钼业',title:'2027届矿世奇才校园招聘',city:'北京（宣讲会）',time:'2026-09-16 19:00-21:00',venue:'逸夫楼604',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=7b097cbdb877409c8ac60759cbd4484d&'},
    {company:'中冶赛迪集团有限公司',title:'2027届校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-16 19:00-21:00',venue:'时代凌宇报告厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=7e9b985a5f79454daa2e3465dffb64fa&',merge:'cisdi'},
    {company:'容百集团',title:'2027届校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-16 19:00-21:00',venue:'机电楼106',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=d898e9c5a3f046438b8f0e186167077b&'}
  ];
  const SEPT23_FAIR_ITEMS = [
    {company:'航天电器',title:'“筑梦航天 星辰可及”2027届秋季招聘',city:'北京（宣讲会）',time:'2026-09-23 10:00-11:30',venue:'教学楼501',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=16443c16632a495ba5156eae9e303439&'},
    {company:'中信特钢',title:'2027届校园招聘',city:'北京（宣讲会）',time:'2026-09-23 10:00-11:30',venue:'时代凌宇报告厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=37381eef8ed44cdcb9b5bac46f0dadf8&'},
    {company:'海天集团',title:'2027届秋招宣讲',city:'北京（宣讲会）',time:'2026-09-23 13:30-15:00',venue:'时代凌宇报告厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=e528940399ff4086a67578d38d107569&'},
    {company:'北京经纬恒润科技股份有限公司（HiRain）',title:'2027年校园招聘宣讲会北京科技大学站',city:'北京（宣讲会）',time:'2026-09-23 15:30-17:00',venue:'逸夫楼507',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=79bacc45000245dfbfcf06b5e1f90765&',merge:'hirain'},
    {company:'华丞电子',title:'“华章初启，丞载未来”2027校招宣讲会',city:'北京（宣讲会）',time:'2026-09-23 15:30-17:00',venue:'时代凌宇报告厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=c5e0e0c37bf84f6db822923ad640d501&'},
    {company:'浪潮集团',title:'2027届校园招聘宣讲会',city:'北京（宣讲会）',time:'2026-09-23 19:00-21:00',venue:'时代凌宇报告厅',url:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=ac908916a64e4bd8aff200bec0a622aa&'},
    {company:'SGS',title:'2027校招空中宣讲会',city:'线上',time:'2026-09-23 18:00-20:00',venue:'线上',url:'https://weixin.qq.com/sph/AKlD6sFsLN',detailUrl:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=64481161609b40628c61f1f632dcc8d3&',merge:'sgs'}
  ];
  const YST_NFS_WANTAI_URL = 'https://app.mokahr.com/m/campus_apply/yst/68367?recommendCode=DSCJQN4a#/jobs';
  const YST_NFS_WANTAI_GROUP_URL = 'https://docs.qq.com/doc/DUHJjeHpLUHNFYnRI';
  const YST_NFS_WANTAI_COLLECTION_URL = 'https://docs.qq.com/smartsheet/DUEFqWGN2bWN1WnRS';
  const YST_NFS_WANTAI_TEXT = `养生堂·农夫山泉·万泰生物2027届校园招聘
企业介绍：养生堂创立于1993年，业务涵盖饮品和农产品、生物医药、保健食品和化妆品等；农夫山泉成立于1996年并已在港股上市，拥有17大天然水源、30+生产基地、40+销售大区，产品包括NFC、茶派、农夫山泉、东方树叶等。
招聘岗位：堂堂新生人才计划；行销类（销售市场）；生产类（生产制造、动力、品保、供应链等）；信息技术类（算法、AI开发、自动化软件）；职能类（产业项目管理、知识产权、设备采购、人力、财务）；基础研发类（人工智能应用）；生物医药类（工艺、分析方法开发、生化检测）；品牌类（品牌、设计）；应用研发类（设备开发、饮品开发、茶原料开发、生物防治、发酵技术）。
招聘对象：2025-2027届毕业生。
网申链接：${YST_NFS_WANTAI_URL}
内推码：DSCJQN4a
校招交流群：${YST_NFS_WANTAI_GROUP_URL}
2027届校招内推信息集合：${YST_NFS_WANTAI_COLLECTION_URL}`;
  const MAMMOTION_URL = 'https://jobs.mammotion.cn/campus_recruitment/';
  const MAMMOTION_TEXT = `库犸科技 Mammotion 2027届全球校园招聘北京科技大学宣讲会
库犸科技成立于2016年，是国家专精特新“小巨人”企业，专注智能户外机器人领域，拥有割草机器人、泳池机器人两大产品线，并探索具身智能在更多真实场景中的应用。团队规模1000+，产品服务全球家庭用户75万+，业务覆盖30+国家和地区。
招聘对象：毕业时间为2026年9月—2027年12月的本科及以上学历应届毕业生，专业不限。
宣讲会时间：2026年9月14日17:30。
热招岗位：硬件、结构、嵌入式、测试、感知/SLAM/GNSS/规控算法、机器人全栈软件、多模态算法、VLA大模型算法、服务运营培训生、跨境电商运营、海外市场营销等。
福利待遇：七险一金、丰厚年终奖、中晚餐补贴、年度体检、节日福利、生日补贴、大牛带队、咖啡下午茶、丰富社群活动。
校招投递链接：${MAMMOTION_URL}`;
  const LENOVO_URL = 'https://talent.lenovo.com.cn/home';
  const LENOVO_QA_URL = 'https://docs.qq.com/doc/DRkxIU3ZjZ1FUcFBm';
  const LENOVO_TEXT = `联想集团2027届秋招启动！
联想是一家成立于中国、年收入超过4100亿人民币、业务遍及180个市场的全球化科技公司。
招聘岗位：产品与项目、技术、市场与销售、职能、供应链、设计等六大方向。
工作地点：北京、上海、深圳、天津、武汉、成都、广州、杭州、南京、厦门、长沙、郑州、济南、沈阳、哈尔滨、昆山、南宁等20多个地点。
网申链接：${LENOVO_URL}
校招答疑：${LENOVO_QA_URL}
内推码/推荐人itCode：2027XZLMXX。
投递提示：之前在联想校招官网已创建过简历的，需要重新创建简历才能填写内推码；创建简历时在“我的简历-其他”中“从哪儿获知招聘信息”选择“联想员工推荐”，并输入推荐人itCode：2027XZLMXX。`;
  const XIAOHONGSHU_URL = 'https://datayi.cn/w/rREX0089';
  const XIAOHONGSHU_TEXT = `小红书校园正式岗位招聘
小红书是年轻人生活方式社区，汇聚海量真实的生活分享，期待心怀热爱、敢想敢做的应届生加入。
招聘对象：全球本科、硕士、博士应届毕业生，专业不限，以毕业证/学位证时间为准。
开放岗位：技术类（后端、前端、客户端、AI、大数据、搜索推荐、安全等）；产品类（用户产品、商业产品、AI产品经理等）；非技术类（运营、商业化、市场营销、数据分析、用户研究、设计、战略职能等）。
投递链接：${XIAOHONGSHU_URL}`;
  const ECOFLOW_URL = 'https://jobs.ecoflow.com/s/TrR63uj6lrI';
  const ECOFLOW_TEXT = `移动储能独角兽—正浩创新EcoFlow2027届校招启动！
正浩创新是移动储能行业市占第一、移动储能第一家独角兽企业，拥有1000+专利、全球超600W忠实用户，业务覆盖全球140+国家和地区。
岗位需求：研发、产品、营销服、供应链、采购、职能、设计。
工作地点：深圳、苏州、西安。
薪酬待遇：行业TOP薪酬、多重员工福利，部分岗位薪酬最高可达50w，特别优秀同学可配股。
内推链接：${ECOFLOW_URL}
内推码：6DHKG7V（内推投递，简历优先筛选，面试流程加快）。`;
  const TUHU_UPDATED_URL = 'https://app.mokahr.com/m/campus_apply/tuhu/28398?recommendCode=DSjwV8zP#/jobs';
  const TUHU_UPDATED_TEXT = `港交所上市&中国互联网100强——途虎养车27届秋招
途虎养车2011年成立，2023年在港交所上市，同年入选中国互联网100强企业。途虎养车工厂店超9000家，1.75亿注册用户，是全球门店规模最大的汽修连锁品牌。
校招岗位：工程类（全栈、客户端、测试、数据开发、硬件工程师等）；算法类（感知算法、定位算法、避障算法、算法工程师等）；产品类（C端/B端、产品运营等）；运营类（发展策略、商家策略、商品策略、汽车适配数据运营等）；供应链类（物流、供应链等）。
工作城市：上海、武汉。
投递链接：${TUHU_UPDATED_URL}
校招HR内推码：DSjwV8zP。`;
  const CSCEC_INTERNATIONAL_URL = 'https://hr.cscec.com/api/short_url?id=wv87j';
  const CSCEC_INTERNATIONAL_TEXT = `中建国际2027届校园招聘
中建国际作为中国建筑旗下唯一总部设于国内、以海外业务为核心、国内外一体化协同发展的二级子企业，实行北京、苏州双总部运营。
招聘专业：土木类、交通类、测勘类、安全类、环境类、材料类、物流类、电气类、机械类、给排水、建筑环境与能源应用、职能管理类、语言类等相关专业。
公司优势：行业第一梯队薪酬待遇；国内外一体化发展平台，海外工作机会充足；国内工作地点稳定，主要面向长三角地区城市。
薪酬福利：六险二金、带薪年假、伙食补贴、交通补贴、通讯补贴、办公补贴、地区津贴、职业资格津贴、外语津贴、驻外津贴等。
投递链接：${CSCEC_INTERNATIONAL_URL}
投递邮箱：zhang_hongpo@chinaconstruction.com
说明：原文另有校招微信群二维码，未提供可复制的群链接。`;
  const SUGON_TEXT = `中科曙光2027校园招聘宣讲会
宣讲时间：9月16日 19:00
宣讲地点：北京科技大学海淀校区逸夫楼706
招聘岗位方向：超算互联网、高端计算、存储、高速网络、工业互联网、高端工作站、云计算、项目管理、储备销售经理。
海报提供扫码投递简历二维码，未提供可复制的投递 URL。`;
  const KEHUA_DATA_FAIR_URL = 'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=7ed95a24658740cdaa3501cc4576b43e&';
  const KEHUA_DATA_URL = 'https://app.mokahr.com/campus-recruitment/kehua/92510#/';
  const KEHUA_DATA_TEXT = `【现场宣讲】科华数据股份有限公司
宣讲时间：2026-09-15 15:30
宣讲地点：招生就业多功能厅
宣讲链接：${KEHUA_DATA_FAIR_URL}
企业网申链接：${KEHUA_DATA_URL}
科华数据（股票代码002335）创立于1988年，深耕电力电子与数字技术创新，形成数据中心、高端电源、清洁能源三大业务矩阵，服务网络覆盖全球100余个国家和地区，以“AI+数字能源”为核心提供智慧电能及智算解决方案。
需求专业：电力电子、电气工程、自动化、控制工程、能源与动力工程、新能源、储能等；其他专业均有匹配岗位。
福利待遇：本科15-25W；硕士25-40+W；博士一人一议。
备注：现场收简历、现场面试。`;
  const INTCO_UPDATED_TEXT = `英科医疗2027届校园招聘宣讲会
宣讲时间：2026-09-18 17:30，结束收简历，现场直接初试。
宣讲地点：招生就业多功能厅。
英科医疗为上市公司、中国品牌500强，全球化发展平台，员工20000+，提供食宿、股权激励、带薪旅游等福利。
招聘流程：现场简历投递→直接初试→5天内复试完成→3日内出Offer。
需求专业：计算机类、机械类、自动化类、化工类、外语类、管理类等。
工作地点：北京、济南、淄博、潍坊、青岛、上海、江苏、江西、安徽、海外等。
英科young计划薪资：15W-30W；英才计划薪资：年薪25W-45W。
投递方式：加群关注宣讲会通知，参与校园宣讲会，结束收简历，现场直接初试。`;
  const INTCO_POSTER_TEXT = `英科医疗·英科再生英才计划2027届校园招聘海报
英科医疗部分：医疗器械耗材研发、生产、营销企业，海报展示了医用耗材、康复医疗器械、理疗护理、个人护理等产品布局及公司发展信息。
英科再生部分：面向2027届校园招聘，设置英才计划，涉及软件研发、机械研发、职能等方向。
海报显示岗位薪资范围：软件研发类25-55W；机械研发类25-55W；职能类25-40W。
招聘岗位中包含Agent开发工程师、AI工程师等方向；具体工作地点、岗位要求和投递方式以海报二维码进入的岗位页面为准。
海报包含“英科医疗投递通道”和“英科再生投递通道”二维码，当前未提供可复制的投递 URL。`;
  const SANY_URL = 'https://sany.zhiye.com/campus/jobs?shareId=2189bd5a-292c-4c1f-b011-e0933a007a2d&shareSource=2';
  const SANY_TEXT = `三一集团2027届全球校园招聘启动！
三一集团是世界500强高端装备制造企业，布局工程机械、新能源、数智化赛道，业务覆盖全球180多个国家和地区。
招聘岗位：研发技术类、计算机及AI类、生产制造类、营销服务类、商务采购类、财务金融类、综合管理类。
工作地点：国内长沙、上海、北京、广州、昆山、沈阳、珠海、成都、西安等；海外多国均有岗位。
福利待遇：行业竞争力薪酬激励、清晰的人才发展通道、完善福利保障、领军管培专项培养机会和全球化发展平台。
内推链接：${SANY_URL}
内推码：ESKM1A（内推投递，简历优先筛选）。`;
  const CF_MOTO_TEXT = `春风动力
${CF_MOTO_URL}`;
  const LEAPMOTOR_TEXT = `零跑汽车
${LEAPMOTOR_URL}`;
  const VISIONOX_TEXT = `维信诺
${VISIONOX_URL}`;
  const ANKER_TEXT = `🚀 【含内推码】安克创新2027届全球校园招聘启动
9大类岗位，1000+offer！
【公司介绍】跨境电商龙头，全球29个办公室，从设计研发，到营销体验，与我们一起，千亿营收，百万年薪！等你共同奔赴全球
【岗位需求】研发技术、产品与体验、设计、市场营销、采购与供应链、品质、职能、制造
【工作地点】深圳/长沙/北京等7城 · 美国/加拿大/澳大利亚等10国
【薪酬待遇】晋升率38.1% · 薪资不封顶，经营分享奖近9亿元，覆盖51%员工
【网申链接】${ANKER_URL}
🔑 选择【大使推荐】
【内推码】3S7SHME
内推通道优先筛选/面试 · 让你的优秀率先被看见
⚡️欢迎，下一位创造者`;
  const QYXDL_TEXT = `启源芯动力2027届校园招聘正式启动啦
启源芯动力是新能源商用车先进技术开发和能源服务商，是国家交通强国建设试点任务牵头实施单位。我们聚焦电动重卡及工程机械等设备研发、车储共用电池系统研发制造、充换电设施运营与源网荷储一体化项目建设，不断推动交通与可再生能源的高质量融合发展，市场占有率处于领先地位。
100+岗位，多个岗位方向：研产销服供：参与产品研发、制造交付、供应保障和客户技术服务；电池银行&充换电场站运营：管理电池资产，让电池更安全、更高效、更有价值。让充换电站高效运行，让客户车辆稳定补能；市场与创新业务：把绿色交通能源服务带到更多客户和更多场景。我们有完善的薪资福利体系：具有竞争力的薪酬体系｜完善的福利保障｜绩效激励与成长奖励｜多元职业发展通道
投递简历：${QYXDL_URL}
推荐码：EVVM9B`;
  const METAX_TEXT = `【沐曦股份2027届校园招聘正式启动📢】
沐曦股份致力于自主研发全栈高性能 GPU 芯片及计算平台，为人工智能训练、推理，图形渲染，科学智能等提供“通用易用、稳定可靠”的算力支撑，成为数字经济发展的基石。
🔹 招聘对象：2027届海内外应届毕业生
🔹 岗位方向：硬件、软件、商务、管理四大类
🔹 工作地点：上海、南京、北京、成都、深圳、杭州、长沙
🔹 投递方式：${METAX_URL}
具体岗位信息详见校招官网，感兴趣的同学可点击链接或扫描海报二维码投递简历。
岗位有限，建议尽早投递。`;
  const SUNWODA_TEXT = `欣旺达2027届全球校园招聘正式开启
全球锂离子电池领军企业｜全球新能源企业 500 强｜中国企业 500 强；1997年成立，深交所+瑞交所双上市，覆盖消费类电池、动力电池、储能电池、能源服务、智能硬件、创新与生态六大板块
面向对象：2027 届本硕博应届生；工作地点：深圳、惠州、南京、南昌、德阳、西安、金华、枣庄等 20+城市可选
热招岗位：研发类｜制造类｜职能类｜营销类；每位同学最多投递2个志愿哦~更多岗位情况可点击投递链接查看
招聘流程：网申→测评→AI 面试→专业面试→发放 offer；薪酬福利：具备市场竞争力全面薪酬体系；园区食堂+员工宿舍，食宿配套完善；丰富休闲设施、兴趣社团，丰富业余生活
人才发展：大胆启用年轻人，给机会压担子，成长速度快；管理+专业技术双通道晋升路线；启明星/管培生等专项计划，系统培训+实战历练+导师带教
专属推荐码：EVHT82（内推简历优先筛选）；投递链接：${SUNWODA_URL}`;
  const REO_TEXT = `睿联2027届校园招聘；睿见视界，联动未来
睿联技术自2009年创立以来，始终引领安防摄像头和智能视觉领域的创新。凭借在音视频处理、网络通讯与智能算法等核心技术上的全球领先优势，睿联技术已迅速崛起为国际顶尖的安防摄像头品牌。
岗位：产品研发、销售运营、市场推广、职能支持
投递简历：${REO_URL}`;
  const CAINIAO_TEXT = `菜鸟27届应届生招聘正式启动！
菜鸟是全球供应链领导者，全球仓网面积超1000万平米，覆盖国内仓和进口仓，形成全场景、多层级的仓储布局。依托柔性、绿色与数字化的解决方案，为品牌和商家提供一站式全球供应链服务。
招聘方向：算法、研发、产品、运营、数据、物流、职能、销售
投递简历：${CAINIAO_URL}`;
  const FANDOW_TEXT = `📣【日化新锐・凡岛】27 届秋招正式启动！
—— 不凡不设限，JOIN FANDOW ——
🔶【关于凡岛】
凡岛创立于 2007 年，是一家全数据驱动的日化新消费品公司，布局功效护肤、洗护等多个品类，旗下拥有护肤品牌 WIS、IRY，洗护品牌 KONO 卡厘、赫系等多个新国货品牌。
✅【27 届秋招岗位】
日化产品类（研发/产品经理/供应链/品控）18-24w；市场商务类（商务经理/线下商务）18-24w；广告营销类（营销经理/电商经理/主播教练）18-24w；综合职能类（总助/人资行政/内控/公关）18-24w；AI技术类（AI技术经理/AI工程师/AI产品经理）22-26w；财务管理类（财务专员/会计/财务BP）11-21w。
💡【岗位亮点】体系化培养；晋升通道清晰；扁平化管理。
📍【工作地点】广州黄埔区，交通便利，环境优雅
内推码：DOY81JC
内推投递链接：${FANDOW_URL}
秋招交流群：${FANDOW_GROUP_URL}
更多2027届校招内推信息，可查看腾讯文档《2027届校招内推信息集合》
${FANDOW_COLLECTION_URL}`;
  const HIKVISION_TEXT = `海康威视 2027 校园招聘
【PC端（建议）】海康威视一校招官网：${HIKVISION_URL}
【移动端】公众号“海康威视招聘”→点击“校园招聘”
求职 tips：若投递移动端“微简历”，还需尽快登录 PC 端完善简历
【招聘项目请选择】2027 校园招聘`;
  const UBTECH_TEXT = `优必选
${UBTECH_URL}`;
  const TPLINK_GLOBAL_TEXT = `#TP-Link联洲2027届秋季校招火热进行中
涉足消费网络、消费电子、商用网络、商用安防、运营商网络、软件和云服务等领域的全球性跨国集团，在中国、越南和巴西布局全球制造和供应体系，拥有4大研发中心、42家海外公司，进驻超19万家零售门店和700家电商平台，常年稳居WLAN产品出货量全球第一。
招聘岗位：研发类、产品类、营销类、制造类、供应链类、人力资源类、行政类、财务类、设计类；行业高水平薪资+丰厚日常福利+节日惊喜；深度培训+1v1导师带教+双轨道晋升
投递：${TPLINK_GLOBAL_URL}
推荐码：EV3GVK`;
  const TPLINK_CN_TEXT = `#TP-LINK（普联）2027届秋季校园招聘正式启动
三十而砺，行宽见远。若你对TP-LINK的印象还停留在路由器，不妨重新认识一下。三十年，我们已从千家万户走向千行百业，蜕变为一家集设备、平台、软件和服务于一体的数智化整体解决方案提供商，为中国数字化社会建设提供专业服务。磨砺三十载，今朝试锋芒，2027届秋季校园招聘全面开放9大类岗位，我们期待你的加入！
【投递通道】PC端：${TPLINK_CN_URL}
内推码：XYDS013（在提交简历前的最后一栏“TP内推码”中填写，内推简历优先筛选）`;
  const MOONTON_TEXT = `沐瞳2027秋季校园招聘正式启动！
一、我们是：沐瞳科技是最早一批致力于游戏出海的中国公司，也是拥有最多海外玩家的中国游戏公司之一。公司总部位于上海，在全球多地设有分支机构。创立之初，沐瞳便立足于全球化游戏的开发及发行，已成功推出多款在海外具有高知名度的移动游戏产品，包括《决胜巅峰》《幻世与冒险》《潮汐守望者》《Magic Chess：Go Go》《银与绯》《发条总动员》等。
二、招聘对象：2027届毕业生
三、招聘岗位：产品类、技术类、美术类、发行类、职能类
四、福利待遇：六险一金+补充公积金、全薪病假、10天家庭关爱假、免费健身房、餐补、年度旅游等
五、内推投递链接：${MOONTON_URL}
内推码：KE79QVH
点击上方链接投递将会自动填充内推码，无需手动填写；如手动填写内推码，需要选择“大使内推”。
六、筛选简历的关注点：产品类关注游戏经历和游戏理解；技术类关注项目分工、论文及竞赛；美术类请提交个人作品；发行类关注游戏经历及英文能力。
秋招交流群：${MOONTON_GROUP_URL}
更多2027届校招内推信息，可查看腾讯文档《2027届校招内推信息集合》
${MOONTON_COLLECTION_URL}`;
  const CVTE_TEXT = `CVTE视源股份2027届全球校园招聘正式启动！只A股上市公司；希沃seewo、MAXHUB等行业领军品牌
[成长加速，年轻不设限]专属导师带教，定制化培养，多领域课程培训；管理/专业双发展通道，多领域产业发展机会
[热招岗位]九大类岗位：软件类、硬件类、算法类、商务类、职能类、制造&质量类、供应链类、设计类、研究类
【薪酬福利】能力定薪，年度服务奖，绩效奖金，多项补贴；免费星级自助三餐+班车+代租公寓；健康管理中心、健身房、恒温泳池、影院等园区配套
【工作地点】广州、苏州、合肥、西安、重庆、上海、武汉等
网申投递：${CVTE_URL}
专属内推码：CVTEXAWSK（招聘来源选择“内部推荐”后即可填写内推码）
加入CVTE，年轻的力量将被看见！`;
  const SZKINGDOM_TEXT = `金融科技行业龙头—金证科技27届秋招已开启！
【公司简介】金融科技行业头部公司，交易所、证券、基金、期货、银行和信托等机构整体解决方案的首选服务商，上市公司（600446，SH），AA级证券公司交易系统占比50%，余额宝、理财通核心技术搭建。
【校招&实习岗位】C/C++、Java、Web、大模型应用等开发工程师；软件售前/维护/测试/实施等工程师；大模型算法工程师；销售经理；软件产品设计师。
【薪酬福利】有竞争力的薪资，年度调薪，六险一金，2年免费住宿/租房补助，周末双休，校招生专属培训方案，高潜人才晋升通道等！
【工作城市】深圳、上海、成都、长沙等
【投递链接】一键内推：${SZKINGDOM_DIRECT_URL}
官网投递：szkingdom1.zhiye.com/campus/jobs；网申页面顶部填写推荐码：ESKJB2，简历优先筛选！
一起探索前沿金融科技！一起探索更优秀的自己！`;
  const HOYMILE_TEXT = `豪迈
微信公众号文章：${HOYMILE_URL}`;
  const REO_UPDATED_TEXT = `深圳睿联技术27届秋招火热进行中！
【公司简介】成立于2009年，始终引领安防摄像头和智能视觉领域的创新。产品和服务覆盖全球110多个国家和地区，公司已荣获国家高新技术企业、深圳市专精特新企业认证。
【职位类别】研发类：嵌入式软件开发、前端开发、硬件、结构、测试等工程师（13-42w/年）；销售运营类：海外渠道销售、海外商务运营、跨境电商运营、数字营销、技术/现场支持工程师、物流专员（14-28w/年）；市场品牌类：视觉设计、视频剪辑（14-25w/年）；职能支持类：计划专员、法务专员、知识产权专员、物流专员（财务方向）、产品认证工程师、工业设计师（13-28w/年）。
【招聘对象】2027届毕业生（2026.9-2027.8）
【薪酬福利】富有竞争力的薪资，还有各类礼包礼金、丰厚激励奖励、高速成长赋能、贴心健康关怀等。
【工作地点】深圳
【网申链接】${REO_UPDATED_URL}
网申页面填写推荐码：DSrR9Tgr，提高简历通过率。`;
  const CHANGYOU_TEXT = `搜狐畅游2027届校招启动！
公司介绍：畅游是中国领先的互联网游戏开发和运营商，搜狐全资子公司，总部位于北京市。
畅游生活：透明晋升通道、绩效奖金、专业及管理向双通道发展、活水政策、高潜计划；校招编制保护、导师制度、集训课程、专业课程、课程基金；15天带薪年假、3天春节探亲假、法定休假；七险一金、24小时健身房、瑜伽室、年度体检、家属体检。
岗位类型：策划、开发、美术、测试、运营、职能、业务、技术
岗位地点：北京、重庆
面向人群：2027届应届生
投递链接：${CHANGYOU_URL}`;
  const QUNAR_TEXT = `去哪儿旅行 | 2027届校园招聘来啦
去哪儿成立于2005年，中国第一家旅游搜索引擎公司。
岗位类型：技术类、产品类、运营类
工作地点：北京、上海
面向人群：毕业时间2026年9月1日-2027年8月31日
驼厂福利：“3+2”混合办公，每周三、周五可以灵活选择办公地点；弹性工作制，带薪年假10天起，有应届生旅游基金；超多兴趣俱乐部+机酒员工优惠
投递简历：${QUNAR_URL}`;
  const QUNAR_UPDATE_URL = 'https://datayicn/w/xogkXY2o';
  const QUNAR_UPDATE_TEXT = `去哪儿旅行 | 2027届校园招聘来啦
去哪儿成立于2005年，中国第一家旅游搜索引擎公司。
岗位类型：技术类、产品类、运营类。
工作地点：北京、上海。
面向人群：毕业时间2026年9月1日-2027年8月31日。
福利：“3+2”混合办公，每周三、周五可以灵活选择办公地点；弹性工作制，带薪年假10天起，应届生旅游基金；兴趣俱乐部、机酒员工优惠；不定时掉落代言人扫楼。
内推链接（按本次消息原样保留）：${QUNAR_UPDATE_URL}`;
  const HUOLALA_URL = 'https://app.mokahr.com/m/campus-recruitment/huolalahr/98660?recommendCode=DSmQKzkT#/jobs';
  const HUOLALA_GROUP_URL = 'https://docs.qq.com/doc/DWnZrSVRjSmxYaFha';
  const HUOLALA_TEXT = `货拉拉2027届校园招聘全面开启
企业概况：深圳依时货拉拉科技有限公司，2013年成立于香港，是一站式互联网物流商城，融合AI、大数据实现智能车货匹配，覆盖国内三百余城、全球超400座城市。
招聘岗位分类：
管理储备：GMT全球拓展管培生。
技术研发：算法、后端、前端、大数据、云平台、运维安全。
业务线：产品、用户运营、城市管理、市场增长、企业商业化。
支持职能：人力资源、财务、法务、战略分析、项目管理。
工作城市：核心base深圳、北京、上海、广州；二线城市长沙、重庆、杭州等；海外包括中国香港、东南亚、欧美各国业务分部。
投递链接：${HUOLALA_URL}
内推码：DSmQKzkT
秋招交流群：${HUOLALA_GROUP_URL}`;
  const TAISTING_TEXT = `北京泰斯汀通信技术有限公司
公司邮箱：sales@testingtech.com.cn
联系电话：186 1834 6758（同步微信）
公司网址：www.testingtech.com.cn；www.tesitngtech.com.cn

【公司简介】
北京泰斯汀通信技术有限公司（简称 Beijing Testing）成立于2011年，致力于通信及自动化测试领域的研发与服务。公司服务于能源、汽车、电信、机器人、卫星互联网等多个行业，为国内外客户提供高品质的通信协议栈研发、自动化测试工具，以及专业的技术服务支持。

【泰斯汀通信与能源实验室】
实验室成立于2023年，配备国际一流的通信与能源研发及检测设施，致力于为汽车、光伏、储能、充电设施、机器人、卫星互联网等多个行业提供专业的研发验证服务。实验室位置：北京总部基地新华双创园B栋210。

【招聘岗位】
嵌入式软件开发工程师；嵌入式硬件开发工程师。
本科生正式岗位：5名；研究生实习岗位：3名。

【人才要求】
电气设计基础理论、模拟电路和数字电路设计；C/C++；DSP/FPGA/ARM嵌入式系统硬件开发；嵌入式电路设计；PCB及设计经验；Altium Designer、Cadence及电路仿真分析软件；网络、操作系统、数据结构；Makefile、gdb、shell、交叉编译；Ubuntu、CentOS、OpenWRT；uboot、busybox；Linux及良好编程习惯。

【公司与福利】
公司拥有国际一流的研发能力和检测设备，服务于电动汽车、光伏、储能、充电设施、机器人、卫星互联网等行业。试用期3-4个月，实习期统一基本工资，实习期结束后工资根据个人能力逐步上涨；转正后提供五险保障；根据个人能力获取年终奖金；一年一度员工旅游。

官网：${TAISTING_URL}
PDF中另列网址：${TAISTING_ALT_URL}`;
  const DF_WESTON_TEXT = `烟台东方威思顿电气有限公司
（国有企业）
【企业简介】烟台东方威思顿电气有限公司成立于2003年，是大型国有企业东方电子集团旗下致力于构建新型电力系统，服务国家“双碳”战略，从事数字电力、智慧能源和数智工厂三大领域，集产品研发、生产、销售和服务于一体的国家级重点高新技术企业，是领先的能源计量与管理、电网配用电及数字化智能工厂整体解决方案提供商。公司注册资本为人民币3.5亿元，资产规模超40亿元。公司研发队伍由博士、硕士和本科学历的专业科研人员组成，有泰山产业领军人才、教育部首批入库的双创导师、多名能源计量及管理领域的资深专家等。
公司与中国计量科学研究院、中国电力科学研究院、中国科学院沈阳自动化所、上海交通大学、西安交通大学、吉林大学、山东大学等科研院所建立了稳定密切的产学研合作关系，与兰州大学、电子科技大学、西安电子科技大学、华北电力大学等院校建立了优势互补、互利双赢的创新实践实习基地；构建了“双职业发展通道”和“双职业导师制”。
公司拥有各类知识产权400余项；参与制订国际、国家及行业标准170余项；项目及成果荣获国家能源计量示范项目、国家单项冠军产品、中国专利奖、山东省企业管理奖、省市级科技进步奖20余项；通过国家级和省级鉴定的科技成果近30项，其中“国际领先”6项；先后承担国家级、省级重大科技研发项目10余项。
【招聘对象】应届毕业生
【招聘岗位】结构设计、软件研发（Java）、国内方案营销、软件研发（C语言）、海外技术支持、海外项目经理、海外方案营销、软件研发（嵌入式）、硬件研发
【专业需求】电气、电力电子、自动化、测控、通信、计算机、软件工程、信息、高分子材料、机械、国际贸易、经济、数学、外语等相关专业应届生
【投递方式】手机端网申入口：${DF_WESTON_URL}；扫描二维码投递简历；扫码进群获取更多信息。`;
  const IROBOTICS_TEXT = `【杉川机器人】2027届杉尖计划校招启动！
【关于杉川】全球扫地机器人解决方案出货量稳居TOP1；杉川集团以全域自研、极限制造能力为核心，将“全技术”与“全制造”相结合，在研发、制造、品牌、核心部件等领域引领创新，为各行业提供创新产品和技术解决方案，共建更美好的社会。
【招聘岗位】工作地点：深圳、合肥、苏州；软件算法类、硬件结构类、产品项目类、营销运营类、供应链&质量类、平台职能类。
【校招流程】初筛→笔试→测评→业面→综面→Offer
【学校专属推荐码】DSsd1zWy
【简历投递】${IROBOTICS_URL}`;
  const AMEC_TEXT = `中微公司
微信公众号文章：${AMEC_URL}`;
  const LIULIAN_TEXT = `六联智能
微信公众号文章：${LIULIAN_URL}`;
  const HISENSE_IM_TEXT = `海信国际营销
微信公众号文章：${HISENSE_IM_URL}`;
  const HISENSE_POSTER_TEXT = `海信集团2027届校园招聘空中宣讲会
主题：来创造你的可能「信」
时间：9月3日（周四）19:00
预约方式：扫描海报二维码预约直播
宣讲内容：未来同事分享职场真实故事；职场、成长、未来等求职与校招问答；直播间福利抽奖
关注渠道：海信集团招聘官方视频号、海信集团招聘小红书账号
说明：本海报未提供可复制的投递 URL。`;
  const HORIZON_TEXT = `地平线2027届秋季校园招聘正式开启
【公司简介】以“赋能智能汽车和机器人，让人类生活更安全、更美好”为使命，地平线是市场领先的乘用车智能辅助驾驶解决方案供应商。公司方案整合了领先的算法、专用的软件和先进的处理硬件，为汽车智能化提供核心技术。
【招聘方向】算法、芯片、软件、硬件、测试、业务拓展等多种岗位
【招聘对象】2026年9月1日-2027年8月31日毕业的海内外应届毕业生
【岗位城市】北京、上海、南京、杭州、成都、西安、深圳等
【校招流程】简历投递→面试评估→人才测评→Offer沟通
【薪资福利】基础薪资+绩效奖金+各类福利补贴等；弹性办公，周末双休；校招生量身培养方案，专属导师保驾护航
【投递方式】一键内推：${HORIZON_REFERRAL_URL}
官网投递：${HORIZON_OFFICIAL_URL}，选择“校园招聘”，填写内推码：ogyqlc
少年同路人，期待共征程，等一个你！`;
  const HORIZON_AUTUMN_URL = 'https://wecruit.hotjob.cn/SU62d915040dcad43c775ec12c/mc/position/campus?acotycoCode=csfylp&projectId=103302&recruitType=1&isLimitShowPostScope=1';
  const HORIZON_AUTUMN_TEXT = `上场，与世界交手｜地平线2027届秋季校园招聘正式启动
地平线立足智能驾驶与机器人赛道，推动软硬件深度融合，面向真实物理世界开展全场景智驾方案研发。
招聘对象：2026年9月1日至2027年8月31日毕业的海内外应届毕业生。
招聘方向：算法、芯片、软件、硬件、测试、业务拓展等多种岗位。
岗位城市：北京、上海、南京、杭州、成都、西安、深圳等。
校招流程：简历投递→面试评估→人才测评→Offer沟通。
正式批投递链接：${HORIZON_AUTUMN_URL}`;
  const EMDOOR_TEXT = `亿道集团2027届校园招聘正式启动！
【关于亿道】亿道成立于2002年，主要从事软件增值分销及智能硬件，如笔记本电脑、平板电脑、智能商显、迷你PC、商用清洁机器人、VR/AR等产品的研发、生产与销售。业务遍及100多个国家和地区。
【招聘岗位】研发岗：产品经理、项目工程师、嵌入式软件工程师、算法工程师、硬件工程师、结构工程师、热设计工程师、测试工程师；非研发岗（不限专业）：智能制造管培生（品质管理/工程技术/生产交付方向）、采购、成本工程师、人力资源。
【工作地点】深圳、重庆
【薪资年包】本科：10-27W；硕士：20-35W
【福利待遇】六险一金、公租房、健康体检、酒店式公寓、智慧餐厅、免费班车、健身房、篮球场等。
【内推投递方式】${EMDOOR_URL}
内推码：ESKPAV
秋招交流群：${EMDOOR_GROUP_URL}
更多2027届校招内推信息，可查看腾讯文档《2027届校招内推信息集合》
${EMDOOR_COLLECTION_URL}`;
  const KELONG_TEXT = `科华集团
微信公众号文章：${KELONG_URL}`;
  const SPEECH_TEXT = `思特奇
微信公众号文章：${SPEECH_URL}`;
  const CETC55_TEXT = `中国电科五十五所
微信公众号文章：${CETC55_URL}`;
  const ZHUOYU_TEXT = `卓驭2027校园招聘正式启动！速投！
【关于卓驭】掌握大模型算法、数据闭环等核心技术，具备成熟量产经验；为车企提供可落地的智能驾驶解决方案，已获上百款车型合作；涵盖乘用车、商用车、物流车以及通用自主移动机器人场景，迈向移动物理AI。
【招聘岗位】算法、软件、机械电气、嵌入式、测试、安全、系统工程、非研发等多方向岗位。
【加入卓驭】有竞争力的薪酬、住房补贴等多方位福利；量产级项目实战；工程师文化；完善的成长体系，包括1v1导师制、定制化培养方案和每年晋升窗口。
推荐码：ESSPGB，简历优先筛选！
投递链接：${ZHUOYU_URL}`;
  const BOKE_TEXT = `波克27届秋季校园招聘开启啦！
【公司介绍】上海超香游戏公司！现有游戏已覆盖休闲竞技、收集养成、模拟经营、策略对战等多个品类，业务范围覆盖全球200+国家和地区，在全球拥有超5亿注册用户，日活跃用户2000万+，作为小游戏头部厂商，多款产品长期稳居畅销榜头部；2023年位列互联网百强17位。
【薪酬待遇】行业竞争力薪酬、多重员工福利、免费三餐+租房补贴、年度带薪旅游等。
【招聘岗位】研发、美术、策划、发行、职能、技术
【工作地点】上海市普陀区
【投递链接】${BOKE_URL}
专业不限，欢迎热爱游戏的同学加入！`;
  const HANGTIAN_DADAO_TEXT = `航天大道
微信公众号文章：${HANGTIAN_DADAO_URL}`;
  const MANBANG_TEXT = `满帮集团 2027 届校园招聘正式开启
【工作地点】南京、苏州、上海、北京
【招聘对象】2027 届海内外高校应届毕业生，毕业时间：2026.10-2027.09
【热招方向】技术类：算法、全栈开发、数据、安全、智加科技自动驾驶岗位；产研业务：产品、运营、经营分析、业务岗；平台职能：多类职能岗位开放，理工科、经管商科同学均有适配机会。
【企业与校招亮点】美股上市“数字货运第一股”，多次入选中国500强，国内数字货运平台头部企业；集团深耕物流大数据，控股智加科技攻坚干线L2+/L4自动驾驶，核心技术全栈自研；AI、大数据、自动驾驶技术在海量真实业务场景中落地；网申周期8.26-11.30；笔试面试均线上完成，三轮线上面试。
专属推荐码：DSP2bKg3
投递链接：${MANBANG_URL}`;
  const HUAWEI_WIRELESS_TEXT = `华为27届岗位已正式上线！！
部门专注于无线领域网络规划优化，设有通用大模型与专业大模型岗位业务。
【投递步骤】
1. 进入官网地址：${HUAWEI_CAREER_URL}
2. 选择类型：应届生
3. “关键字”搜索应届生岗位（本硕）：
AI模型工程师—AI算法/后训练与强化学习/Agent技术
AI应用工程师—AI技术应用
软件开发工程师-通用软件开发工程师
算法工程师-通信算法/仿真算法/感知算法
4. 选择部门：ICT BG-无线网络研发部
5. 投递完成后尽快短信回复或者加微信确认投递情况，并提供CV简历编号。`;
  const GITI_TEXT = `🔥佳通轮胎2027届校园招聘机会来啦！
佳通轮胎深耕轮胎研发、制造、测试与销售，产品服务全球多个国家和地区，并为毕业生提供培养计划与职业成长平台。
【招聘对象】2027届毕业生及符合岗位要求的在校生、应届生
【招聘方向】研发、制造、质量、供应链、计算机与职能管理等
【工作城市】上海、合肥、莆田、牡丹江等
【投递链接】${GITI_URL}
投递提示：点击链接，在“经验”中选择“应届生”；当天投递，内推处理效率更高！`;
  const WANNENG_TEXT = `旺能环境股份有限公司
（上市公司）
【企业简介】旺能环境股份有限公司总部位于两山理念发源地浙江湖州，是专业从事生活垃圾、餐厨垃圾、市政污泥等固体废弃物综合处置的环保产业公司，连续七年居全国固废行业十强。下属浙江旺能环保有限公司致力于生活垃圾无害化处置，在浙江、广东、福建、河南、四川、安徽、湖北、广西、贵州、甘肃等10个省投资垃圾焚烧发电项目达33个，其中已经运营的项目有18个，日处理生活垃圾20000多吨。
海外业务方面，旺能环境于2019年正式开拓海外市场，截至2021年底，在澳大利亚、新加坡、柬埔寨、越南等国家设立了项目公司或办事处，同时在马来西亚、印度尼西亚、英国等国家和地区均有项目洽谈。2021年7月，公司首个海外项目柬埔寨首都金边市的环卫一体化项目正式投产。
【招聘对象】应届毕业生
【招聘岗位】汽机工程师助理、锅炉工程师助理（运行）、热控工程师助理（运营）
【专业需求】自动化、能源与动力工程、测控技术与仪器等相关专业应届生
【投递方式】手机端网申入口：${WANNENG_URL}；扫描二维码投递简历；扫码进群获取更多信息。`;
  const GEEKPLUS_TEXT = `极智嘉
微信公众号文章：${GEEKPLUS_URL}`;
  const RONGZHI_TEXT = `容知日新 2027 届招聘简章
安徽容知日新科技股份有限公司（股票代码：688768）于2021年7月26日在上海证券交易所科创板上市。容知日新成立于2007年，是一家由人工智能驱动的工业服务企业，致力于为客户提供设备智能运维解决方案和订阅式服务。主要产品为工业设备状态监测与故障诊断系统，已广泛应用于电力、石化、钢铁、水泥、煤炭等十多个行业，并远销至欧洲、南美洲、北美洲、东南亚等地区。
【招聘岗位】
1 AI算法工程师-R&D｜2人｜硕士及以上｜17000-21000元/月｜计算机、应用数学、人工智能等相关专业
2 AI算法工程师-S&V｜2人｜硕士及以上｜17000-21000元/月｜计算机、人工智能、数学、信号处理等相关专业
3 PHM算法工程师｜2人｜硕士及以上｜17000-21000元/月｜故障诊断、机械、人工智能、统计学等相关专业
4 大模型应用/智能体开发工程师｜2人｜硕士及以上｜17000-21000元/月｜人工智能、计算机、应用数学、统计学等相关专业
5 硬件产品经理｜2人｜本科及以上｜14000-20000元/月｜通信工程、电子信息工程、自动化、计算机科学、人工智能、机电一体化等相关专业
6 软件产品经理｜1人｜本科及以上｜14000-20000元/月｜计算机科学、人工智能、统计学、通信工程、电子信息工程等相关专业
7 硬件开发工程师｜3人｜本科及以上｜14000-19000元/月｜电子、通信、自动化等相关专业
8 传感器开发工程师｜1人｜本科及以上｜14000-19000元/月｜电子、机械、智能感知工程、测控、微机电系统工程等相关专业
9 软件开发工程师｜4人｜本科及以上｜14000-19000元/月｜计算机、软件等相关专业
10 嵌入式软件开发工程师｜3人｜本科及以上｜14000-20000元/月｜计算机、电子、通信、自动化等相关专业
11 智能策略软件开发工程师｜2人｜本科及以上｜14000-20000元/月｜信号处理、计算机科学、电子信息、自动化等相关专业
12 软件测试工程师｜2人｜本科及以上｜10000-15000元/月｜通信、电子、计算机、软件等相关专业
13 硬件测试工程师｜1人｜本科及以上｜10000-15000元/月｜电子、通信、计算机、自动化等相关专业
14 诊断技术工程师｜14人｜硕士及以上｜15000-17000元/月｜理工科相关专业
15 解决方案经理｜5人｜本科及以上｜11000-16000元/月｜理工科相关专业
16 市场分析专员｜1人｜硕士及以上｜12000-15000元/月｜理工科相关专业
17 市场推广专员｜1人｜本科及以上｜10000-15000元/月｜市场营销、新闻传播、金融等相关专业
18 数字化运营专员｜2人｜本科及以上｜10000-15000元/月｜计算机、数据科学、应用统计、市场营销、电子商务等相关专业
19 商务专员｜1人｜本科及以上｜10000-14000元/月｜工商管理、市场营销、财务、统计学等相关专业
20 生产工程师｜2人｜本科及以上｜10000-14000元/月｜理工科相关专业
21 生产计划工程师｜1人｜本科及以上｜10000-14000元/月｜理工科相关专业
22 客户质量工程师｜2人｜本科及以上｜10000-14000元/月｜机械、自动化、电子、电气、测控、材料、工业工程、质量管理等相关专业
23 培训运营专员｜1人｜本科及以上｜10000-14000元/月｜专业不限
24 运营专员｜1人｜本科及以上｜10000-14000元/月｜专业不限
25 采购专员｜2人｜本科及以上｜10000-14000元/月｜理工科相关专业
26 财务专员｜2人｜本科及以上｜10000-14000元/月｜专业不限
27 品牌专员｜1人｜本科及以上｜10000-14000元/月｜新闻、广播电视、广告等相关专业
28 IT工程师｜1人｜本科及以上｜10000-14000元/月｜计算机、软件工程、信息管理、电子信息等相关专业
【公司福利】每周三运动日、五险一金、餐补、话补、交通补贴、租房补贴、节日福利、带薪年假、健康体检、慰问礼金、活动基金、社团基金、弹性工作时间。
【投递方式】内推投递链接：${RONGZHI_URL}
内推码：DSqpVauD`;
  const ZHPLUS_TEXT = `智加科技（满帮集团控股）2027 届校招启动
智加科技作为满帮集团的控股子公司，成立于2018年，是一家专注干线物流场景的自动驾驶科技公司。坚持核心技术全栈自研，以“L2+量产”与“L4运营”为双引擎驱动业务持续迭代发展，携手头部车企与物流生态伙伴，以更安全、更智能、更高效的自动驾驶解决方案重新定义货物运输的方式。
自动驾驶独角兽；干线重卡L2+/L4双路线落地；工作地点：苏州、上海、北京；热招方向：算法、软件、系统集成、数据闭环、仿真测试；无统一笔试，大牛带队，免费三餐下午茶，高薪回报；26-27届本硕博可投。
投递链接：${ZHPLUS_URL}`;
  const RONGZHI_UPDATE_TEXT = `容知日新2027届秋季校园招聘正式启动！
容知日新成立于2007年（股票代码：688768），是一家人工智能驱动的工业服务企业，致力于为客户提供领先的设备智能运维解决方案和订阅式服务。业务覆盖欧洲、南美洲、北美洲、东南亚等地区。
【招聘岗位】研发技术类：AI算法、PHM算法、大模型应用、智能体开发工程师、软/硬件产品经理、传感器开发、软件开发、嵌入式软件开发、智能策略软件开发、软硬件测试；市场营销类：解决方案经理、市场分析专员、市场推广专员、数字化运营专员、商务专员；诊断技术类：诊断技术工程师；生产制造类：生产工程师、生产计划工程师、客户质量工程师；职能管理类：培训运营、采购、运营、财务、品牌、IT。
薪资：10-21K，具体各岗位薪资范围及学历要求可查看招聘简章。
招聘简章：${RONGZHI_KDOCS_URL}
【福利待遇】弹性打卡、每周三提前1小时下班、年度健康体检、健身房、员工餐厅等。
【内推投递链接】${RONGZHI_URL}
内推码：DSqpVauD
秋招交流群：${RONGZHI_GROUP_URL}
更多2027届校招内推信息，可查看腾讯文档《2027届校招内推信息集合》
${RONGZHI_COLLECTION_URL}`;
  const DESCENTE_TEXT = `迪桑特27届秋招正式批已启动！
【公司简介】以滑雪、综合训练和高尔夫等专业运动领域为核心的高端专业运动品牌。
【招聘对象】2027届高校毕业生
【工作地点】上海及全国多地
【热招岗位】电商运营、商品运营、零售管理等方向
【投递链接】${DESCENTE_URL}
投递说明：添加微信，后台回复“迪桑特”，可获得投递链接，同时可获得免费秋招、实习岗位表格和海量求职资料，每日更新。`;
  const IROBOTICS_UPDATED_TEXT = `杉川｜杉尖计划 2027 届校园招聘
【工作地】深圳、合肥、苏州
【招聘对象】2027届全球应届毕业生（毕业时间2026.09-2027.08）
【热招方向】软件算法、硬件结构、产品项目、供应链质量、营销运营、平台职能全大类岗位
【项目亮点】全球扫地机器人龙头企业，出货量&销量双TOP1；杉尖计划为集团顶尖人才项目，3年成骨干，5年成将军；四维一体培养机制：领域专家、直线导师、HRD、CEO带教；行业高薪激励，定制化成长路径，优秀人才优先快升。
【投递方式】推荐码：DSJVWK3N，简历优先筛选！
投递链接：${IROBOTICS_UPDATED_URL}`;
  const CHIPSEA_TEXT = `芯海科技2027届校园招聘
芯海科技（股票代码：688595）成立于2003年9月，是一家集感知、计算、控制、电源、连接及AI技术平台为一体的全信号链集成电路科技企业。公司依托“模拟+MCU”双技术平台驱动，为智慧健康、通信与计算机、锂电管理、汽车电子、工业测量、高端消费电子及AI边缘智能硬件等领域提供全信号链芯片及算法的全场景解决方案。
公司总部位于深圳，在北京、上海、成都、合肥、西安、香港、新加坡设立子公司，是国家高新技术企业、国家级专精特新“小巨人”企业，构建了符合汽车电子ISO 26262等八大国际标准的全面质量管理体系。
【目标人群】2027届应届海内外毕业生（毕业时间以学位证书为准）
国内高校毕业时间：2027年1月1日-2027年12月31日毕业
海外高校毕业时间：2026年1月1日-2027年12月31日毕业
登录链接：chipsea.zhiye.com/campus/jobs
推荐码：EVKWS0`;
  const JEE_TEXT = `奔赴星辰大海，从加入巨一开始。
巨一科技2027届校招正式启动；加入巨一，成为“巨新星”；让青春与科技未来同频共振，同向而行。
巨一科技股份有限公司（简称JEE）成立于2005年1月，总部位于合肥，是国家创新型试点企业、国家知识产权优势企业、国家专精特新“小巨人”企业，是国内领先的智能装备和新能源汽车电驱动系统解决方案专家，为汽车尤其是新能源汽车提供车身、动力总成以及动力电池的智能制造解决方案。
【招聘岗位】研发技术、算法软件、具身智能、制造技术、职能、销售支持、供应链
投递：${JEE_URL}`;
  const NINEBOT_TEXT = `【九号公司2027校招开启】
26/27届均可投，岗位投递无数量限制
【工作地】常州、北京、上海、深圳、杭州、珠海
【岗位】研发、产品、设计、营销、供应链、职能、质量等
【九号星计划】高管带教、实战项目、优厚薪资福利
【流程】网申→笔试→面试→发Offer
27届秋招就业岗位：${NINEBOT_QR_URL}
【内推链接】${NINEBOT_URL}
内推码：DSMjRrNg
欢迎投递，欢迎转发给身边同学！`;
  const UNILUMIN_TEXT = `洲明科技2027届秋季校园招聘正式启动！
我们是全球领军的LED显示与照明产品及光显解决方案提供商；荣获国家科学技术进步一等奖、工信部制造业单项冠军等奖项；连续多年LED显示屏销售额世界第一、XR虚拟拍摄领域市占率全球第一。
【需求岗位】研发、市场、产品、智能制造、供应链、职能六大赛道全面开放。
【薪酬福利】行业TOP级薪资待遇，最高可达40W；每年2次晋升调薪机会；员工宿舍、人才房、餐厅；带薪年假、五险一金、U基金、员工及家人年度体检、团建旅游、中医理疗、社团活动等。
【简历投递】${UNILUMIN_URL}
推荐码：ESKMAK`;
  const CASC_TEXT = `航天科技集团
微信公众号文章：${CASC_URL}`;
  const CMB_TEXT = `招商银行
微信公众号文章：${CMB_URL}`;
  const LEIHU_TEXT = `🔥网易游戏雷火 2027 届秋招正式批双选会开启！
【面向人群】2027届理工科在读学生（本科 / 硕士 / 博士）
【工作地点】杭州
【热招岗位方向】引擎图形方向：游戏引擎/渲染、图形图像、AI图形研发；客户端&服务端：游戏客户端、服务端开发、嵌入式开发；研发测试：游戏测试、测试开发、全栈开发、后端开发；策划美术：技术美术、技术策划、虚拟世界架构师（游戏策划）；AI智能体方向：人工智能类、Agent智能体与强化学习、LLM Agent、游戏AI Agent、语音交互、虚拟交互与动画、智能体算法（多模态）、用户个性化Agent、视觉感知、具身智能、机器人算法（规划/控制）、大模型算法（智能NPC）、游戏Harness。
【投递方式】${LEIHU_URL}
扫描二维码参与双选会，选择对应岗位方向获取专属投递链接。`;
  const XUZHIYUAN_TEXT = `旭之源
微信公众号文章：${XUZHIYUAN_URL}`;
  const CITIC_TEXT = `中信集团
微信公众号文章：${CITIC_URL}`;
  const ZTE_TEXT = `中兴通讯
微信公众号文章：${ZTE_URL}`;
  const YONGZHUO_TEXT = `永卓控股
微信公众号文章：${YONGZHUO_URL}`;
  const NORTHERN_IC_TEXT = `北方集成电路
微信公众号文章：${NORTHERN_IC_URL}`;
  const BJ_SPACE_TEST_TEXT = `北京航天试验技术研究所
微信公众号文章：${BJ_SPACE_TEST_URL}`;
  const SGMW_TEXT = `上汽通用五菱
微信公众号文章：${SGMW_URL}`;
  const CISDI_TEXT = `中冶赛迪集团有限公司2027校园招聘已全面启动！
【企业简介】中冶赛迪是世界500强、特大型中央企业中国五矿的骨干子企业。总部位于重庆，入选国务院国资委“双百企业”、“创建世界一流专业领军企业”、“数字化转型试点企业”。以高端咨询为引领，聚集资源协同发展冶金技术、数字智能、能源环保、产城融合、新型材料业务，以自主核心技术产品和高端装备支撑五大业务高质量发展。
【需求专业】材料、金属材料、计算机、软件工程、人工智能、冶金工程、机械工程、矿业工程、热能与动力工程、电气工程、自动化、电子信息、数学等相关专业。
【福利待遇】行业内有竞争力薪酬，优秀人才一人一薪；领跑者培育计划及相应津贴；七险二金；午餐、交通、出差等多种补贴；职工子女教育补助；博士安家费；健身房、游泳池、羽毛球馆、篮球场、足球场、乒乓球馆、台球室、瑜伽室、艾灸理疗室、剪发室等生活设施。
【工作地点】重庆、北京、上海、西安、成都、深圳；英国、俄罗斯、巴西、越南、马来西亚、土耳其等海外分支机构。
【网申地址】${CISDI_URL}`;
  const CISDI_UPDATE_TEXT = `中冶赛迪集团有限公司2027届北京科技大学专场招聘会
宣讲时间：2026年9月16日19:00-21:00（周三）。
宣讲地点：北京科技大学时代凌宇报告厅。
企业简介：中国五矿、中国中冶骨干子企业，国家大型甲级骨干冶金设计单位，面向全球金属行业提供核心技术和装备供给，业务覆盖冶金技术、数字智能、能源环保、产城融合、新型材料等方向。
招聘专业：材料、金属材料、计算机、软件工程、人工智能、冶金工程、机械工程、矿业工程、热能与动力工程、电气工程、自动化、电子信息、数学等相关专业。
福利待遇：行业内有竞争力薪酬，优秀人才一人一薪；领跑者培育计划津贴；七险二金；午餐、交通、出差等补贴；职工子女教育补助；博士安家费；健身房、游泳池、羽毛球馆、篮球场、足球场、乒乓球馆、台球室、瑜伽室、艾灸理疗室、理发室等生活设施。
工作地点：重庆、上海、北京、西安、成都、深圳；英国、俄罗斯、巴西、越南、马来西亚、印度尼西亚、土耳其等海外分支机构。
详细专业信息：${CISDI_FAIR_URL}
网申地址：${CISDI_URL}`;
  const ZTSTEEL_URL = 'https://aim.zt.net.cn/qr/';
  const ZTSTEEL_TEXT = `中天钢铁2027届北科大专场招聘
专场宣讲会：2027年9月17日19:00-21:00，地点：时代凌宇报告厅。
校园招聘会：2027年9月18日9:00-12:00，地点：H26。
企业简介：中天钢铁集团位列中国500强第168位，现有北科大校友80余人，重视人才培养，提供为期一个月的新生训练营、两年保护期、全方位培养、职业生涯三通道，满一年即可参加竞聘。
发展布局：“一总部，多基地”，现有常州、南通、淮安三大基地，可自由选择。
薪酬待遇：本科生年薪12.5万起，研究生年薪18万起，博士面议并分配产权住房；另可享受地方人才补贴。
福利保障：五星级生活区，免费住宿，配套图书馆、健身房；五险一金、带薪年假、探亲假等。
简历投递网站：${ZTSTEEL_URL}
联系人：姬老师15351979109；汪老师15151992395。`;
  const YADEA_URL = 'https://m.liepin.com/company/5955732/?mscid=xy_cx_208';
  const YADEA_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const YADEA_TEXT = `雅迪科技集团有限公司2027届秋招
公司简介：雅迪专注电动两轮车及零部件，将自主研发、制造和销售相结合，提供个人出行相关产品。
招聘对象：2027届应届毕业生。
招聘岗位：营销经理（全国）、助理嵌入式软件开发工程师、助理嵌入式硬件开发工程师、助理电气部品开发工程师、助理售后工程师、初级市场推广专员、初级电商运营专员等。
工作地点：深圳、杭州、武汉、郑州、无锡。
投递链接：${YADEA_URL}
招聘交流群：${YADEA_GROUP_URL}。`;
  const SPRING_AIRLINES_URL = 'https://m.liepin.com/company/8024700/?mscid=xy_cx_208';
  const SPRING_AIRLINES_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const SPRING_AIRLINES_TEXT = `春秋航空股份有限公司2027届秋招
公司简介：春秋航空从事航空旅客运输及相关服务，围绕航班运行、旅客出行与航空业务开展经营。
招聘对象：2027届应届毕业生。
招聘岗位：见习航空工程师、服务管理类培训生、市场管理类专业培训生（航线）、IT产品类培训生、市场管理类专业培训生、运营、财务管理类培训生、算法类培训生等。
工作地点：上海、扬州。
投递链接：${SPRING_AIRLINES_URL}
招聘交流群：${SPRING_AIRLINES_GROUP_URL}。`;
  const CATERPILLAR_URL = 'https://m.liepin.com/company/7873812/?mscid=xy_cx_208';
  const CATERPILLAR_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const CATERPILLAR_TEXT = `卡特彼勒（中国）投资有限公司2027届秋招
公司简介：卡特彼勒在中国开展工程机械及相关设备业务，为基础设施建设、资源开发等应用提供产品、技术和服务。
招聘对象：2027届应届毕业生。
招聘岗位：数据科学工程师、虚拟制造/智能制造工程师、产品技术/制造/供应链/项目/测试、电子/电器/软件、流体仿真工程师、新能源研发工程师、研发-发动机/传动等。
工作地点：上海、天津、青岛、无锡、徐州等。
投递链接：${CATERPILLAR_URL}
招聘交流群：${CATERPILLAR_GROUP_URL}。`;
  const TBEA_URL = 'https://m.liepin.com/company/6493301/?mscid=xy_cx_208';
  const TBEA_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const TBEA_TEXT = `特变电工股份有限公司2027届秋招
公司简介：特变电工围绕能源装备与绿色智慧能源开展业务，为能源产业提供相关设备、技术和系统解决方案。
招聘对象：2027届应届毕业生。
招聘岗位：销售技术支持、研发工程师、电缆研发员、文化宣传岗、技术支持岗、技术营销岗、国际销售经理等。
工作地点：北京、泰安、昌吉、扬州。
投递链接：${TBEA_URL}
招聘交流群：${TBEA_GROUP_URL}。`;
  const YUTONG_JOBS_URL = 'https://www.kdocs.cn/l/ceyn42dCT3ir';
  const YUTONG_TRACK_URL = 'https://qm.qq.com/q/XS9PE9UFeC';
  const YUTONG_APPLY_URL = 'https://app.mokahr.com/m/campus-recruitment/yutong/172567?recommendCode=DSguUxms#/jobs';
  const YUTONG_TEXT = `宇通集团2027届校招正式批
招聘规模：本科生700个、硕士生300个。
关于宇通：宇通是以客车、卡车为主的大型商用车集团，旗下有宇通客车（SH.600066）、宇通重工（SH.600817）两家上市公司，2025年营业收入493.8亿元，累计销售新能源商用车超26万辆。
招聘岗位：管培生类、生产运营类、生产职能类、销售业务类、售后服务类、研发技术类、营销职能类、专业职能类，共30个岗位。
薪酬福利：根据综合面试表现，硕士年薪上限40万元，本科年薪上限28万元；法定节假日、年休假等十余项带薪假期；自营餐厅、优惠公寓、免费通勤班车、节假日礼品等生活保障。
招聘流程：简历投递→简历筛选→面试/测评→录用沟通→Offer发放→签约。
岗位清单：${YUTONG_JOBS_URL}
应聘跟进：${YUTONG_TRACK_URL}
宇通校招官网：${YUTONG_APPLY_URL}`;
  const SMARTMORE_URL = 'https://app.mokahr.com/campus_apply/smartmore/40506?recommendCode=DSTFkchd#/jobs';
  const SMARTMORE_TEXT = `思谋科技 SmartMore 2027校园招聘简章
思谋科技是全球领先的工业AI智能体公司，以全球首个专有工业多模态大模型 IndustryGPT 为核心，整合行业知识、软硬件生态，打造机器人、边缘AI传感器和智能体软件系统，推动制造从自动化走向自主化。
招聘对象：27届本硕博应届生。
招聘岗位：算法研发、软件工程、产品项目、职能管培。
福利活动：六险一金、意外险、补充医疗险、年度体检、配套健身设施。
投递简历：${SMARTMORE_URL}`;
  const KNIGHT_GROUP_URL = 'https://app.mokahr.com/campus_apply/black-unique/29232?recommendCode=DSgGFnYe#/jobs';
  const KNIGHT_GROUP_TEXT = `骑士集团2027校园招聘正式启动
旗下品牌/业务：全球购骑士特权APP、幸棉、麦谷村、科净威。
面向对象：2027届毕业生。
2027综合管培生计划：联合创始人1V1高管带教；产品、市场、运营多模块轮岗；深度参与GMV过亿项目；与顶尖团队共同成长。
薪酬待遇：年薪16-20W，匹配能力价值。
投递简历：${KNIGHT_GROUP_URL}`;
  const IMOU_URL = 'https://imou.zhiye.com/campus/jobs';
  const IMOU_TEXT = `华橙网络（乐橙 Imou）2027届全球校园招聘
华橙网络深耕家庭安全与智能家居领域十余年，以AI智能与物联网技术为核心，构建乐橙安防、乐橙互联、乐橙IoT等产品体系，为全球千万家庭及企业提供智能摄像机、智能门锁、智能门铃等智能家居产品与服务。
招聘岗位：软件研发、算法、研发产品、营销、市场产品。
工作地点：杭州、西安。
投递简历：${IMOU_URL}
学校专属推荐码：ESVP8B。`;
  const MULTIFIELDS_APPLY_URL = 'https://multifields1.zhiye.com/';
  const MULTIFIELDS_SITE_URL = 'https://www.multifields.com';
  const MULTIFIELDS_TEXT = `多场低温科技（北京）有限公司（简称“多场科技”）2027校园招聘
公司介绍：多场科技是国家级专精特新“重点小巨人”企业，专注于纳米级超精密运动和位置传感，以及极端环境下的材料和器件分析与测量。应用领域覆盖半导体、量子科技、商业航天、精密光学和生物医疗等高端产业领域。研发团队中博士占比高，团队以应届生为主，氛围开放、谦逊、多元。
招聘对象：2027届毕业生；国内应届生毕业时间为2026年9月至2027年7月，留学生应届生毕业时间为2027年1月至2027年7月。
研发类岗位：
机械设计工程师（通用机械、压电运动、压电控制、柔性铰链、六轴并联结构、光机、精密运动台等）；光学工程师（光栅尺、激光干涉仪、激光稳频、光学共聚焦等）；物性测量工程师（电输运、磁测量、热学、低温物性、高压等）；低温和磁场工程师（低温强磁场、低温超低振动光学、极低温制冷、低温磁场探杆台、扫描近场光学、SQUID磁性测量等）；电路类工程师（硬件电路、FPGA、嵌入式软件、上位机软件等）；算法工程师（运动控制算法、减振算法）；精密电学位移传感工程师（电容、电涡流位移传感）；减振控制工程师（主动减振）。
业务类岗位：销售工程师、售后技术支持工程师。
职能类岗位：商务专员、财务专员。
福利待遇：行业领先的薪资、绩效奖金、人才政策、长期激励、六险一金、住房支持。
工作地点：北京、上海、合肥。北京总部位于北京市怀柔区有色金属研究院2号楼；上海、合肥设有办公室。
投递方式：PC端${MULTIFIELDS_APPLY_URL}；招聘HR李老师，邮箱 liyang@multifields.com；公司网站：${MULTIFIELDS_SITE_URL}。海报另附多个二维码，具体以二维码页面为准。`;
  const TAIKANG_URL = 'https://m.liepin.com/company/163359/?mscid=xy_cx_208';
  const TAIKANG_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const TAIKANG_TEXT = `泰康保险集团股份有限公司2027届秋招
公司简介：泰康保险集团围绕保险、资产管理与医养开展业务，连接风险保障、健康养老及全生命周期服务需求。
招聘对象：2027届应届毕业生。
招聘岗位：数据科学岗、金融服务运营岗、云计算管理岗、智能体研发岗、算法研发岗、AI安全工程师、客服运营管理岗等。
工作地点：北京、武汉、济南。
投递链接：${TAIKANG_URL}
招聘交流群：${TAIKANG_GROUP_URL}。`;
  const TRANSSION_URL = 'https://m.liepin.com/company/8459640/?mscid=xy_cx_208';
  const TRANSSION_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const TRANSSION_TEXT = `深圳传音控股股份有限公司2027届秋招
公司简介：传音面向新兴市场提供以手机为核心的智能终端与移动互联网服务，旗下拥有TECNO、itel、Infinix等品牌。
招聘对象：2027届应届毕业生。
招聘岗位：助理采购工程师、助理采购PE工程师、助理采购运营工程师（AI专项）、采购管培生（雏鹰专项）、助理综合采购工程师（海外）等。
工作地点：深圳、重庆。
投递链接：${TRANSSION_URL}
招聘交流群：${TRANSSION_GROUP_URL}。`;
  const SPDB_CHANGSHA_URL = 'https://job.spdb.com.cn';
  const SPDB_CHANGSHA_WECHAT_URL = 'https://mp.weixin.qq.com/s/hRU67Md6wAc7LJOxgQi73A';
  const SPDB_CHANGSHA_TEXT = `浦发银行长沙分行2027年度校园招聘
招聘岗位：业务储备生（公司业务方向、零售业务方向、综合运营方向）、科技储备岗。
招聘对象：2025、2026、2027届毕业生，不限专业。
工作地点：长沙等。
截止时间：10月8日18:00。
网申链接：${SPDB_CHANGSHA_URL}
公众号链接：${SPDB_CHANGSHA_WECHAT_URL}`;
  const BLUEFOCUS_REFERRAL_URL = 'https://delivassist.careerready.cn/';
  const BLUEFOCUS_TEXT = `北京蓝色光标数据科技集团股份有限公司（BlueFocus，300058）2027届校园招聘
招聘项目：AI超级基地计划，面向2027届毕业生，招聘以下四类岗位：
1. AIBuilder—研发（2027秋）：本科及以上，计算机科学、人工智能、软件工程等相关专业优先，工作地点覆盖上海、北京、广州等9个城市。
2. AIBuilder—产品（2027秋）：本科及以上，研发与产品方向 JD 内容一致，工作地点覆盖上海、北京、深圳等9个城市。
3. AI营销解决方案专员（2027秋）：本科及以上，专业不限，工作地点覆盖上海、北京、深圳等9个城市。
4. AI创作者（2027秋）：学历详见任职要求，影视制作、动画、数字媒体、3D、导演等相关背景优先，工作地点覆盖上海、北京、深圳等9个城市。
招聘对象：2026年9月1日至2027年8月31日期间毕业的海内外应届毕业生（中国大陆以毕业证为准，非中国大陆以学位证为准）。
工作地点：上海、北京、深圳、广州、杭州、东南亚等9个城市。
福利待遇：行业领先薪资；绩效、项目及技术攻关奖金；北京和怀柔人才政策；股票激励/期权等长期激励；六险一金（含补充商业医疗保险，公积金双边12%）；人才公寓或住房支持。
薪酬：具体以HR/Offer为准。
投递方式：扫描 PDF 海报二维码或在招聘平台搜索“蓝色光标2027届校招”投递对应岗位；内推通道：${BLUEFOCUS_REFERRAL_URL}
投递提示：请注明推荐学院及专业；岗位详情和二维码以原 PDF/招聘页面为准。`;
  const YAO_PIN_URL = 'https://app.mokahr.com/m/campus_apply/ypgj/164305?recommendCode=DSyPC6Zv#/jobs';
  const YAO_PIN_TEXT = `姚品国际2027届管培生招聘
公司简介：姚品国际聚焦卡牌业务和潮流品类，拥有宝可梦、原神等热门IP，渠道、媒体、赛事资源雄厚，拥有1600+线下零售终端，覆盖全国一二三线城市。
招聘对象：2026-2027届毕业生，潮玩、零售、快消爱好者优先。
岗位：管培生，提供全链路轮岗、1V1导师带教和定制化成长路径。
工作城市：上海、北京、广州、深圳、南京、武汉、长沙、西安、合肥、大连、川渝、东北等多区域。
薪酬福利：年薪15-30万；免费食堂、健身房等。
网申链接：${YAO_PIN_URL}
目标院校专属内推码：DSyPC6Zv（内推简历优先筛选，面试流程加快）。`;
  const DATA_INSTITUTE_URL = 'https://xyz.51job.com/External/Apply.aspx?CtmID=8934808';
  const DATA_INSTITUTE_TEXT = `数据所2027届校园招聘
招聘特点：朝阳行业、中央企业，解决北京户口，薪酬福利较好，提供协议薪酬与安家费、青年员工宿舍及多方位配套体系。
工作地点：北京、西安、青海、上海、东莞、武汉。
招聘岗位：密码算法与技术研究员、信息安全架构工程师、嵌入式开发工程师、应用软件开发工程师、FPGA开发工程师、IC芯片研发工程师、网络空间安全研发工程师、人工智能算法工程师、硬件电路设计与分析工程师、信号处理工程师、解决方案设计/销售工程师、系统集成项目工程师。
网申链接：${DATA_INSTITUTE_URL}
说明：原文仅称“数据所”，单位全称、招聘对象和具体薪酬以网申页面为准。`;
  const CCSCEC4_INSTALL_URL = 'http://kmeb2c24vmn16kc3.mikecrm.com/EDCnt9y';
  const CCSCEC4_INSTALL_TEXT = `中建四局安装工程有限公司2027届校园招聘
公司简介：中建四局安装工程有限公司是世界500强中国建筑旗下中建四局直属大型建筑专业公司，总部位于广州黄埔区，是粤唯一工程局，国家高新技术企业及中建四局旗下唯一生产型专业公司。
招聘专业：电气工程、电气工程及其自动化、建筑环境与能源应用、能源与动力工程、给排水科学与工程、土木工程、工程力学、焊接技术与工程、市政工程、地下空间、智能建造、电气工程与智能控制、矿业工程、机械工程、过程装备与控制、测控技术与仪器、机械制造及自动化、机械电子工程、工程管理、工程造价、水务工程、水利水电工程、风能与动力、光伏发电技术、新能源工程、安全工程、勘察技术与工程、测绘工程、会计学、财务管理、金融学、经济学等相关专业。
薪酬福利：基本工资、绩效奖金、福利及津补贴；五险一金、企业年金；节日/生日慰问、带薪休假、脱产培训、定期体检、探亲报销、免费食宿等。
工作地点：广东、贵州、安徽、福建、湖北、四川、江苏、新疆、海南、河南、陕西、青海、东三省等。
招聘流程：投递简历→线上测试→面试→发放录用函→三方签约。
投递链接：${CCSCEC4_INSTALL_URL}`;
  const HONOR_BEIKE_SIGNUP_URL = 'https://retail.honor.com/dist/questionnaire/?questionnaireId=6aa20ab193a4f65c940b0591#/';
  const HONOR_CAREER_URL = 'https://www.hihonor.com/cn/career/';
  const HONOR_BEIKE_TEXT = `荣耀2027届校园招聘——北京科技大学专场宣讲会
宣讲时间：2026年9月22日（周二）10:00。
宣讲地点：北京科技大学时代凌宇报告厅。
活动内容：业务大牛与HR现场交流业务、成长和薪资，现场解答求职疑问并抽奖。
宣讲报名：${HONOR_BEIKE_SIGNUP_URL}
简历截止：2026年9月30日24:00。
官网投递：${HONOR_CAREER_URL}
公众号：荣耀HONOR招聘-校园招聘。`;
  const KINGSOFT_GAME_URL = 'https://m.liepin.com/company/161720/?mscid=xy_cx_208';
  const KINGSOFT_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const KINGSOFT_GAME_TEXT = `北京金山软件有限公司2027届秋招
招聘方向：本次招聘围绕游戏业务展开，涉及游戏研发、策划、产品运营与市场推广。
招聘对象：2027届应届毕业生。
招聘岗位：战斗策划、游戏客户端开发工程师、市场创意策划、广告投放、新媒体运营、游戏系统策划、产品运营等。
工作地点：北京、成都、武汉。
投递链接：${KINGSOFT_GAME_URL}
投递提示：点击链接选择对应岗位投递；当天投递，内推处理效率更高。
招聘交流群：${KINGSOFT_GROUP_URL}`;
  const FOTON_RI_TEXT = `青春有为，星耀福田——2027北汽福田工程研究总院校园招聘正式启动
公司：北汽福田工程研究总院。北汽福田成立于1996年，是隶属于北汽集团的国有控股上市公司，也是中国品种最全、规模最大的商用车企业，产品和服务覆盖全球140多个国家和地区。
研发方向：整车工程开发、底盘开发、动力传动系统开发、车身工程开发、产品试验与验证、性能开发；智能网联开发、新能源开发、燃料电池开发、氢能开发、电控开发；融合定位算法开发、决策规划算法开发、智驾控制开发、智驾云平台开发、智驾仿真开发、智能驾驶功能策略开发；博士后工作站方向包括新能源开发、智能网联开发、轻量化开发、燃料电池开发、智能驾驶开发、电控技术开发。
招聘对象：2027届全球应届毕业生，博士、硕士优先。
专业方向：车辆、机械、自动化、计算机、电子信息、人工智能、材料等专业。
工作地点：北京、广州、潍坊、诸城、青岛、长沙。
福利待遇：五险一金、过节费、节日慰问、生日福利、法定节假日、带薪年假；厂区食堂、餐饮补贴、员工福利住房、租房补贴、免费班车、北京落户资质；定期员工体检、免费健身房、员工活动中心、党团活动等。
校招频道：9月起开展校招宣讲、校招答疑、校园大使、大咖分享等活动。
投递方式：联系人李经理，010-56716708；邮箱投递：litongtong4@foton.com.cn。`;
  const QXGY_WECHAT_URL = 'https://mp.weixin.qq.com/s/qxgy-Ym0kyxLXNM5KbnmIw';
  const QXGY_WECHAT_TEXT = `微信公众号文章
原文链接：${QXGY_WECHAT_URL}`;
  const XCMG_URL = 'https://app.mokahr.com/campus-recruitment/xcmg/148091#/jobs?zhineng%5B0%5D=190553';
  const XCMG_TEXT = `徐工集团2027届校园招聘
网申链接：${XCMG_URL}
说明：当前仅收到徐工集团网申入口，具体岗位、工作地点、招聘对象和薪酬以职位页面为准。`;
  const SHANTUI_URL = 'https://shantui.zhiye.com';
  const SHANTUI_TEXT = `山推工程机械股份有限公司2027届校园招聘——北京科技大学站
宣讲时间：2026年9月22日（星期二）19:00。
宣讲地点：北京科技大学逸夫楼601。
公司简介：山推股份（股票代码000680）是国有股份制上市公司、山东重工集团权属子公司，总部位于山东济宁，业务覆盖工程机械及零部件研发、制造、销售和服务，推土机产销量全球领先。
招聘岗位：研发技术（新能源、机械、机械电子、电气、控制、液压、仿真、力学、动力、车辆、材料成型等）；市场营销（俄语、西班牙语、葡萄牙语、法语、阿拉伯语、越南语及机械类等）；信息技术（计算机、软件工程、网络安全、大数据、人工智能、物联网、算法开发等）；财务管理；行政管理。
学历要求：本科及以上。
薪酬待遇（不含补贴和奖金）：本科10.8-12万元/年；硕士13.2-14.4万元/年；博士面议。
福利：六险二金、高温补贴、取暖补贴、深造培训、人才公寓、租房补贴、免费午餐、免费班车、免费体检等。
工作地点：济宁、临沂、青岛、扬州、德州、济南、武汉。
简历投递：${SHANTUI_URL}`;
  const CCS_GUANGDONG_URL = 'https://iter.stongyw.cn/web/schoolwx/job/index.html?RCode=260033';
  const CCS_GUANGDONG_TEXT = `中国通信服务广东公司2027届秋招
企业概况：千亿级央企上市集团，中国通信百强第6名、中国软件百强第3名；广东省大型骨干企业，2025年业务总收入超300亿元。
招聘专业：人工智能、计算机、通信、自动化、电子、电力、电气、建筑土木、能源动力、市场营销、财务、法务及其他相关专业。
工作地点：广东广州、深圳等地市，北京、湖南、湖北、广西、重庆、陕西、河南、河北、江苏、上海、天津等省市，港澳地区，以及菲律宾、马来西亚等海外地区。
福利待遇：六险一金、住宿福利、餐费补贴、企业年金、带薪年假。
投递链接：${CCS_GUANGDONG_URL}`;
  const OPPLE_URL = 'https://m.liepin.com/company/1566181/?mscid=xy_cx_208';
  const OPPLE_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const OPPLE_TEXT = `欧普照明股份有限公司2027届秋招
公司简介：欧普照明集研发、生产、销售与服务于一体，产品涵盖照明光源、灯具及电工电器，为家庭和商业场景提供照明解决方案。
招聘对象：2027届应届毕业生。
招聘岗位：电商培训生（用户运营方向）、制造培训生（电子）、采购培训生（生产采购方向）、设计培训生、人力资源培训生、AI开发培训生、财务培训生等。
工作地点：上海、苏州、中山。
投递链接：${OPPLE_URL}
投递提示：选择对应岗位投递；当天投递，内推处理效率更高。
招聘交流群：${OPPLE_GROUP_URL}`;
  const INTIME_URL = 'https://m.liepin.com/company/8974136/?mscid=xy_cx_208';
  const INTIME_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const INTIME_TEXT = `浙江银泰百货有限公司2027届秋招
公司简介：银泰百货围绕百货零售与消费服务开展业务，涵盖服饰、美妆、家居等商品品类，连接线下门店和线上消费场景。
招聘对象：2027届应届毕业生。
招聘岗位：银泰星-AI系统工程师（产技）、银泰星-智能账务管培生、银泰星-业务管培生（企划方向）、银泰星-工程设计管培生、银泰星-综合财务管培生、银泰星-服务运营管培生、银泰星-市场采购管培生等。
工作地点：北京、杭州、西安。
投递链接：${INTIME_URL}
投递提示：选择对应岗位投递；当天投递，内推处理效率更高。
招聘交流群：${INTIME_GROUP_URL}`;
  const CARIZON_URL = 'https://carizon.jobs.feishu.cn/s/BJFJF6mubIk';
  const CARIZON_TEXT = `酷睿程2027届秋招
公司简介：酷睿程是大众CARIAD与地平线合资成立的智驾企业，项目已量产落地，深耕前沿自动驾驶技术。
招聘岗位：算法类、软件研发类、测试类等。
工作地点：北京、上海。
招聘对象：2027届海内外高校毕业生。
福利待遇：行业竞争力薪资、培训成长体系、弹性工作、住房补贴、带薪年假、节日福利、良好工作氛围和舒适办公环境。
内推链接：${CARIZON_URL}
内推码：Y2UTPSN（内推投递，简历优先筛选）。`;
  const SGMICRO_BEIJING_URL = 'https://mp.weixin.qq.com/s/SihQ-xL024yDX2KbhLpHHA';
  const SGMICRO_BEIJING_TEXT = `圣邦微电子2027届校园招聘——北京专场宣讲会及笔试
宣讲时间：2026年9月23日14:00。
宣讲地点：北京丽亭华苑酒店三层鸿运厅。
会后安排：宣讲会后现场笔试，请携带纸质简历；扫码进群了解后续安排。
招聘专业：微电子、集成电路、机电、电气工程及其自动化、电子信息、计算机等相关专业。
工作地点：北京、哈尔滨、大连、上海、苏州、杭州、江阴、厦门、深圳、武汉、成都、香港等。
薪资福利：行业竞争力薪酬、年度奖金、股票期权、专利奖/项目奖等专项奖金；五险一金、补充保险、健康体检、年度旅游、节日礼金、人才落户；双休日、法定节假日及带薪年假、病假等。
推文链接：${SGMICRO_BEIJING_URL}`;
  const JOYIN_URL = 'https://careers.joyintoy.cn/s/nmMp2dwVAtI';
  const JOYIN_GROUP_URL = 'https://qr61.cn/oL88tm/qSHPGP2';
  const JOYIN_TEXT = `JOYIN乐漾2027届秋季校园招聘
公司简介：JOYIN乐漾2016年成立，是全球化玩具与欢庆消费品企业，主营节日欢庆、玩具、母婴产品，覆盖北美、欧洲、中东等全球市场，旗下拥有JOYIN、JOVA等品牌。
招聘对象：2027届海内外毕业生，毕业时间为2026年8月至2027年8月；优秀同学可获得SP Offer。
上海岗位：TikTok/亚马逊运营、产品经理、财务、HR、质量工程师、视觉设计等管培与专业岗位。
深圳岗位：独立站运营、产品设计师、玩具开发工程师等。
长沙岗位：TikTok运营、跨境电商运营、AI制片专员。
福利待遇：有竞争力薪资、年终奖、餐补、交通/出差补贴、五险一金、年度体检、不打卡、5-20天带薪假期；宠物开放日、免费咖啡、主题派对和社团活动等。
内推码：T6UNW13
投递链接：${JOYIN_URL}
内推群：${JOYIN_GROUP_URL}`;
  const NFC_URL = 'https://www.iguopin.com/job?keyword=%E4%B8%AD%E5%9B%BD%E6%9C%89%E8%89%B2%E9%87%91%E5%B1%9E%E5%BB%BA%E8%AE%BE%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8';
  const NFC_TEXT = `中国有色金属建设股份有限公司（中色股份）2027年校园招聘——北京科技大学专场
企业简介：大型央企上市公司，中国有色矿业集团有限公司控股，主营国际工程承包和矿产资源开发，业务遍及哈萨克斯坦、印度尼西亚等“一带一路”沿线20多个国家和地区。
双选信息：2026年9月22日14:00；地点：北京科技大学时代凌宇报告厅中色股份展位。
招聘对象：2027届博士、硕士和本科生。
招聘方向：地采选冶、工程管理、专业工程师、安全环保、数智化管理、财务管理、法务、人力资源管理、宣传等。
专业范围：矿产勘察、采矿、矿物加工、矿业、冶金、工程管理、工程造价、结构、电气、智能制造、控制、机械、安全、环境、计算机、大数据、会计、税务、法学、人力资源、新闻传播等相关专业。
薪酬待遇：本科20-23万/年；硕士24-26万/年；博士28-30万/年；海外派驻薪酬为北京总部的2-2.5倍；骨干员工可享股权激励。
福利成长：北京落户指标、免费三餐、人才引进/交通/外派/持证等津贴、七险两金、补充医疗和商业保险、文体活动场地；管理和专业双序列晋升。
工作地点：北京总部、海外项目部及子公司。
网申入口：${NFC_URL}`;
  const H3C_URL = 'https://career.h3c.com/campus/detail?jobAdId=0d758e9e-5468-4fe5-8b93-33516e3ff032';
  const H3C_TEXT = `H3C新华三集团2027届校园招聘
宣讲时间：2026年9月21日19:00。
宣讲地点：北京科技大学逸夫楼205。
公司简介：新华三集团是新紫光集团旗下核心企业，提供覆盖“算-网-存-云-安-维”的数字化基础设施产品、解决方案和端到端技术服务，2025年营收759.81亿元。
核心岗位：技术支持工程师，培养ICT行业专家，参与数字化与AI相关标杆工程和产业实践。
岗位要求：理工类专业均可投递；工作地点覆盖全国及海外，北京、杭州、大连等地均有岗位。
更多岗位：AI算法工程师、AI调优工程师（Python）、软件开发工程师（C/C++/Java）、软件测试、硬件开发/测试、售前技术经理、客户经理、海外技术支持、产品经理、质量工艺、计划交付、采购、物流、财务、营销等。
投递链接：${H3C_URL}
更多信息：关注“新华三集团招聘”公众号。`;
  const SMOORE_URL = 'https://app.mokahr.com/campus_apply/smoore/150918?recommendCode=DSXc2RHr#/jobs';
  const SMOORE_TEXT = `思摩尔国际2027全球校园招聘
公司定位：提供雾化科技解决方案的全球领导者，业务始于2009年，2020年在港交所上市，全球员工25000+，海外营收占比超过90%，产品远销近100个国家。
工作地点：深圳、长沙、上海、昆明、江门等国内多地。
招聘对象：摩范生（面向本硕），2026年9月至2027年7月毕业的全球高校本科、硕士毕业生；摩术生（面向博士），2025年9月至2027年9月毕业的全球高校博士毕业生。
热招方向：技术研发、产品营销、综合职能、生产运营等全大类岗位。
项目亮点：双摩成长计划，提供定制化1/3/5/7/10成长路线和双通道职业发展；资深导师一年带教、月度沟通；入职三年内专项晋升通道；系统化入职培训及毕业生专项训练营。
内推链接：${SMOORE_URL}`;
  const KTC_RECOMMEND_TEXT = `康冠科技2027届秋季校园招聘正式启动
公司简介：康冠科技是一家全球性平板显示解决方案服务商，专注于提供深度定制化、差异化的平板显示产品，向全球输出中国智造解决方案。
招聘岗位：技术研发、产品设计、市场运营等多类别岗位。
投递链接：${KTC_URL}
推荐码：EVVPT9（填写推荐码，简历优先筛选）。`;
  const GREE_ELECTRONICS_URL = 'https://m.liepin.com/company/13313181/?mscid=xy_cx_208';
  const GREE_ELECTRONICS_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const GREE_ELECTRONICS_TEXT = `珠海格力电子元器件有限公司2027届秋招
公司简介：格力电子元器件专注电力电子元器件研发与生产，面向新能源汽车、光伏、储能、充电桩及工业系统等领域。
招聘对象：2027届应届毕业生。
招聘岗位：研发测试、芯片工艺、物控、模块设备、产品管理、应用设计、销售等方向。
工作地点：珠海。
投递链接：${GREE_ELECTRONICS_URL}
投递提示：选择对应岗位投递；当天投递，内推处理效率更高。
招聘交流群：${GREE_ELECTRONICS_GROUP_URL}`;
  const ALIBABA_LINGXI_URL = 'https://campus-talent.alibaba.com/campus/position?campusShareCode=3gg_Io57xW1n%2F7PBexIDTK8fErPXWfuYFIclI7JbemI%3D&batchId=100000760001&filterParams=%7B%22customDept%22%3A%5B%22YQNHYU%22%5D%7D';
  const ALIBABA_LINGXI_TEXT = `阿里巴巴灵犀互娱2027届校园招聘
业务介绍：旗下拥有《三国志·战略版》《如鸢》《三国志幻想大陆》《风之大陆》《大航海时代：传说》等游戏产品。
招聘对象：2027届海内外毕业生，毕业时间为2026年11月至2027年10月（内地以毕业证为准，港澳台及海外以学位证为准）。
工作地点：广州、上海、北京。
热招岗位：游戏策划、游戏技术、算法&AI、设计、产品/运营/营销、项目管理/服务体验等九大类型40+岗位，专业不限。
投递通道：${ALIBABA_LINGXI_URL}`;
  const QIANLI_URL = 'https://app.mokahr.com/m/campus-recruitment/qianli1/147197?recommendCode=DSX8Nh7R&hash=%23%2Fjobs';
  const QIANLI_TEXT = `千里科技（AFARI）2027届校园招聘
公司定位：聚焦“AI+车”的科技企业，将智能汽车作为具身智能的重要载体，提供智能驾驶、智能座舱、Robotaxi等产品与解决方案。
技术优势：自研端到端大模型底座，算法与数据统一架构；拥有超50万台车量产交付经验、2500万Clips场景数据、23EFLOPS算力，并开放全栈软硬件生态。
招聘岗位：校园招聘包括算法类、研发技术类、交付类、产品/解决方案类、运营类、职能类（采购助理、设计师、销售助理、产业规划与发展专员等）；AFARI-X计划开放算法类岗位。
投递规则：每个项目最多可投递2个岗位，系统优先处理较早投递的岗位，投递后不支持修改职位。
工作地点：上海、北京、成都、杭州、重庆、宁波等。
福利待遇：有竞争力的薪资、10天带薪年假、节日礼盒等。
投递链接：${QIANLI_URL}
推荐码：DSX8Nh7R（填写后简历优先筛选）。`;
  const SUPCON_URL = 'https://m.liepin.com/company/7868784/?mscid=xy_cx_208';
  const SUPCON_GROUP_URL = 'https://work.weixin.qq.com/gm/a9f2a8476aca7dcdc71ae20629618bee';
  const SUPCON_TEXT = `中控技术股份有限公司2027届秋招
公司简介：中控技术面向流程工业的自动化、数字化与智能化需求，通过工业技术与AI应用支持生产运营升级。
招聘对象：2027届应届毕业生。
招聘岗位：技术营销支持工程师、海外大项目销售专员、渠道销售工程师、质量工程师、硬件开发工程师、装配钳工、海外销售运营专员等。
工作地点：杭州；部分岗位地点待明确。
投递链接：${SUPCON_URL}
投递提示：选择对应岗位投递；当天投递，内推处理效率更高。
招聘交流群：${SUPCON_GROUP_URL}`;
  const NOVASTAR_URL = 'https://novastar.zhiye.com/campus/jobs?shareId=118b5fb4-f6bd-4ade-b887-42a831266bda&shareSource=2&qr=1&memory=%7B%7D&silence=1';
  const NOVASTAR_TEXT = `诺瓦星云2027届校园招聘
公司简介：全球具有竞争力的LED显示解决方案服务商，曾参与冬奥、世界杯、春晚等世界级舞台项目，研发投入充足。
福利与发展：校招生专属星火计划、1v1导师带教；管理和专业双晋升通道，短期及中长期激励；西安、深圳、北京及海外多地岗位，提供海外发展机会；扁平化管理、年轻团队和跨部门协同。
岗位方向：研发类包括软件、嵌入式、算法、FPGA、硬件、模拟电路、测试；营销类包括营销管培生、区域代表、技术支持、产品与解决方案（含海外）。
投递链接：${NOVASTAR_URL}`;
  const HUNAN_TALENT_FAIR_URL = 'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=00f5ae81f74146c7b750af9c79f10230';
  const HUNAN_TALENT_FAIR_TEXT = `“智汇潇湘、才聚湖南”专场宣讲会·北京科技大学站
主办/组织：湖南人才市场，携省内名企来校招聘。
活动规模：6家省内名企，80+优质岗位，500+招聘名额；原文列举参会企业含拓维信息、希迪智驾、长沙楠菲微电子、衡阳镭目科技、岱勒新材料科技等。
岗位方向：人工智能、芯片设计、自动驾驶、智能制造、软件研发、交通运输等；本科、硕士均可投递。
时间：2026年9月22日17:30。
地点：北京科技大学逸夫楼406。
活动详情/预约：${HUNAN_TALENT_FAIR_URL}`;
  const ROOT_GLOBAL_URL = 'https://app.mokahr.com/campus_apply/rootglobal/44850?recommendCode=DSAVWB43#/jobs';
  const ROOT_GLOBAL_TEXT = `路特创新2027届秋季校园招聘
招聘方向：技术、运营、设计、综合四大方向。
技术类：结构助理工程师、嵌入式助理工程师、AI软件产品助理。
运营类：海外营销运营助理、用户运营、项目管理助理。
设计类：交互设计助理、体验设计助理、视觉设计助理。
综合类：HRBP助理、物流助理、法务助理、会计助理。
岗位理念：关注真实用户需求，参与创造被用户需要的产品。
投递链接：${ROOT_GLOBAL_URL}`;
  const WONDERSHARE_URL = 'https://datayi.cn/w/nombgaV9';
  const WONDERSHARE_TEXT = `万兴科技2027届全球校园招聘
公司定位：AIGC上市公司，面向全球开展数字创意软件及AI相关业务。
招聘对象：2027届本科、硕士、博士应届毕业生。
工作地点：深圳、长沙、北京、杭州、日本东京。
热招方向：研发、产品、营销、设计、职能五大岗位序列。
福利与亮点：高新不设限，优秀应届生年薪可达100W；免费提供AI工具与模型资源；参与公司级重大项目并享项目奖金；清晰的人才成长与晋升路径；优秀校招生可提前转正；入职解锁万兴产品VIP全家桶；提前实习可享每月1500元食宿补贴。
学校专属推荐码：EVK4BR
投递链接：${WONDERSHARE_URL}`;
  const AERODYNAMICS_TEXT = `中国航天空气动力技术研究院
微信公众号文章：${AERODYNAMICS_URL}`;
  const GUANGQI_TEXT = `光启
微信公众号文章：${GUANGQI_URL}`;
  const RONBAY_TEXT = `容百集团2027届全球校园招聘
（上市公司）
【企业简介】宁波容百新能源科技股份有限公司（简称“容百科技”，股票代码：688005）是一家高科技新能源材料行业的跨国型集团公司，专业从事锂电池正极材料的研发、生产和销售，由中韩两支均拥有二十余年锂电池正极材料行业成功创业经验的团队共同打造。公司于2019年7月22日登陆上交所科创板，成为科创板首批25家上市公司之一。
旗下成员包括湖北容百锂电材料有限公司、贵州容百锂电材料有限公司、北京容百新能源科技有限公司、宁波容百锂电贸易有限公司、JS株式会社、韩国EMT株式会社六家控股子公司，合营韩国TMR株式会社。公司与宁德时代、比亚迪、LG化学、天津力神、孚能科技等客户建立长期合作关系。
公司是国内首家实现NCM811大批量产的正极材料生产企业，建立省级科研中心及博士后工作站，承担多项国家级科技研发项目。
【招聘对象】2027届应届毕业生
【招聘岗位】研发类、生产制造类、营销供应类、工程类、智能类、AI专项、海外专项、管培生专项
【专业需求】材料、化学、电气、自动化、测绘、安全、机械、能源动力、新能源、冶金、计算机、统计学、物流、土木工程、力学、软件工程、财务管理、工商管理、国际商务、市场营销、金融、法学、英语等相关专业应届生
【投递方式】手机端网申入口：${RONBAY_URL}；扫描二维码投递简历；扫码进群获取更多信息。`;
  const SGS_TEXT = `SGS
微信公众号文章：${SGS_URL}`;
  const CIIC_TEXT = `中智
微信公众号文章：${CIIC_URL}`;
  const WATERDROP_TEXT = `水滴公司校招
内推码：AHHW53Y
投递链接：${WATERDROP_URL}`;
  const YOTTA_TEXT = `青春无限，大友可为 | 友塔游戏2027秋季校园招聘启动！
【招聘岗位】技术开发类、产品策划类（策划管培生、技术策划管培生、项目管理管培生）、发行运营类（市场管培生、运营管培生）、艺术设计类。
【你能收获】有竞争力的薪资、五险一金、年度2次调薪、年度体检、年假12+、餐补、房补、团建、生日/节庆福利、无限量饮料雪糕零食、丰富水果。
【工作地点】上海
【投递】${YOTTA_URL}`;
  const OPPO_TEXT = `OPPO2027届校园招聘启动！
【公司简介】OPPO于2004年正式成立，是全球领先的智能设备创新者。
【招聘岗位】产品类、AI/算法类、软件类、硬件类、设计类、工程技术类、销售服务类、品牌策划类、采购类、综合职能类等
【工作地点】东莞、深圳、成都、上海、北京、西安、南京、重庆、武汉、海外
【福利待遇】极具竞争力的薪资+定制化培养体系+多样化发展机制
【投递链接】${OPPO_URL}
【内推码】X8335075（内推简历优先筛选，加速流程推进）`;
  const FANRUAN_TEXT = `帆软 2027 届校园招聘正式启动！
✅ AI+BI前景赛道 | 中国BI行业连续 8 年市占率第一
✅ 独角兽企业 | 2000+员工 | 重视校招同学培养
✅ 全国20+城市有岗，家乡也能有一线城市待遇
面向对象：2027届本科及以上
招聘岗位：研发、产品、设计、销售、职能等
地点：南京、杭州等
投递链接：${FANRUAN_URL}
简历直达HR，欢迎同学们投递！`;
  const CHINA_NORINCO_TEXT = `中国兵器
微信公众号文章：${CHINA_NORINCO_URL}`;
  const RUANKONG_TEXT = `【📍山东青岛装备制造业上市公司】软控股份2027届秋季全球校园招聘正式启动

百余岗位（含非标机械设计、机加工艺、电气PLC、软件算法开发、系统实施运维、采购、财务等）
橡胶机械行业世界冠军
智能制造、新兴业务、新材料三大领域
起源于青岛科技大学的国际化高科技上市公司！

📢常规校招岗位：
综合年薪-本科：10.5-13W  硕士：13-17W
📢另有未来之星计划，聚焦优质拔尖人才，开放机械设计及PLC开发岗位，2-3年快速成长，技术骨干或管理角色多渠道晋升，配备战略管理高管导师、技术骨干专业导师和助力成长生活老师
综合年薪-本科：13-15.5W   硕士：14.5-18W

周末双休、带薪年假、六险一金、免费公寓、餐补话补交通补、海外工作机会

宣讲精美伴手礼、惊喜大抽奖、宣讲结束现场面试，等你来，一起智造热爱与未来！
▶网申平台：ruankong2027.zhaopin.com
▶校招负责人：姜老师17854274335（微信同号）`;
  const RUANKONG_UPDATE_TEXT = `软控股份
微信公众号文章：${RUANKONG_WECHAT_URL}`;
  const SUZHOU_XUCHUANG_TEXT = `苏州旭创科技27届秋招正式批已启动！
⭐【公司简介】中际旭创旗下高速光互连解决方案企业，为云计算和AI基础设施提供高速光模块产品。
📌【招聘对象】2027届本科、硕士及博士毕业生
📌【工作地点】苏州、成都、铜陵、淮安、上海、北京及海外
📌【热招岗位】研发类、智能制造类、职能类
【投递链接】${SUZHOU_XUCHUANG_URL}
（添加微信，后台回复「苏州旭创科技」，可获得投递链接，同时可获得免费秋招、实习岗位表格和海量求职资料，每日更新！机会不容错过）`;
  const HESAI_TEXT = `禾赛科技2027秋招启动！
【公司介绍】禾赛科技是纳斯达克&港交所双上市企业，全球三维感知技术领导者，自研芯片和半导体器件累计交付量全球第一。无人驾驶、ADAS、机器人三大市场市占率全球第一，在上海、硅谷、斯图加特等地设有办公室，在中国和泰国拥有自建工厂，产品覆盖全球40余个国家。
【招聘岗位】系统类、器件类、算法类、软件类、硬件类、光机类、工艺类、芯片类、机械类、产品类、采购类、AI类、销售类
【工作地点】上海、杭州、重庆
【福利待遇】行业TOP级薪资、奖金股票，专家一对一导师带教，落户绿色通道，弹性工作，舒适办公环境，各类员工福利
【内推链接】${HESAI_URL}
【内推码】EQXUXBJ（选择大使推荐，内推简历优先筛选）`;
  const HIRAIN_TEXT = `校企合作专函·2027届校园招聘
致北京科技大学就业办老师的一封信
北京经纬恒润科技股份有限公司（HiRain）·人力运营部
截至2026年8月，公司已有116名北京科技大学校友在职，分布于研发、生产、营销及管理等方向。
公司计划与北京科技大学深化校企合作，2027届校园招聘即将全面启动。
合作计划包括：秋招绿色通道（为老师预留10张复试直通卡，老师推荐的优秀学生可直接免除初试、直通复试）；每季度反馈、实时反馈；产教融合、实习实践基地共建。
海报同时发起问卷调研，二维码用于填写问卷。
发布单位：北京经纬恒润科技股份有限公司人力运营部，2026年8月
说明：本海报未提供可复制的投递 URL。`;
  const SILAN_TEXT = `【芯联集成2027届校园招聘启动】
同学们好，芯联集成2027届校招正式开启啦！
我们是国内领先的半导体与人工智能企业（人员规模5500+，SiC器件国内第一，MEMS代工内地第一），Base浙江绍兴、上海张江/临港。
面向人群：本科及以上，集成电路、微电子、电子信息、电力电子、机械、电气、自动化、物理、计算机、材料、数学等理工科相关专业。
热招岗位：研发类（TD PIE、IP设计、模型、PDK、系统应用、封装设计）、市场销售类、工程技术类、质量类、职能运营类。
加入我们，你将获得：参与前沿技术项目、行业大牛带教、有竞争力的薪酬与清晰的晋升通道。
简历优先处理，快速锁定面试名额。
推文链接：${SILAN_URL}
说明：原文提示点击推文获取投递二维码。`;
  const ZHONGWEI_SEMICON_TEXT = `中微半导体27届秋招正式批已启动！
⭐【公司简介】面向集成电路和泛半导体产业提供刻蚀、薄膜沉积、量检测等关键设备的高端装备企业。
📌【招聘对象】2027届高校毕业生
📌【工作地点】上海、南昌、成都、广州、武汉、合肥、北京、深圳、厦门、泉州等地
📌【热招岗位】设备研发类、公共工程研发类、售后服务类、智能制造类、职能支持类
【投递链接】${ZHONGWEI_SEMICON_URL}
（添加微信，后台回复「中微半导体」，可获得投递链接，同时可获得免费秋招、实习岗位表格和海量求职资料，每日更新！机会不容错过）
【27秋招交流群】${ZHONGWEI_GROUP_URL}
（请在微信或企业微信中打开链接加入群聊）`;
  const CEEC_TECH_TEXT = `中国能源建设集团科技发展有限公司招聘
（国有企业）
一、企业简介
中国能源建设集团科技发展有限公司于2016年3月由中国能建集团发起设立，是中国能建电力试验、发电生产、科技研发及成果转化的经营平台、科技公司。科技公司于2022年划归数科集团管理，是中国能建所属2.0级企业。公司下设华北、华东、华中、西北、华南地区的5家区域电力试验研究院，以及越南、孟加拉、伊拉克、沙特等4家海外分支机构，现有自有员工2000余人，各类用工总计3000余人。目前公司已承揽火电、电网、新能源、核电等各类机组1200余座的电力试验、调试和运行维护业务，其中国际项目130余个，遍布亚、非、欧、南美等30个国家和地区。
公司拥有各类资质70余项，包括电力工程调试企业能力资格一级证书（电源类）、检验检测机构资质认定证书（CMA）、CNAS实验室认证、承装（修、试）电力设施许可证、电力工程施工总承包资质等，企业信用等级为AAA级。科技公司为天津市科技领军培育企业，本部及所属5家区域试研院均为国家高新技术企业。公司拥有6个CMA认证高水平电力实验室，承建有2省市级创新平台，累计获得专利414项，主编或参编国际、国家、行业（企业）标准50余项。IMC智能监控平台获2025年度数科集团科学技术奖二等奖，“新型能源与储能发电智能控制装置研制”入选第七届全国设备管理与技术创新一等奖成果。
公司以“世界能源、中国能建”为组织使命，以“行业领先、世界一流”为战略愿景，矢志成为高质量发展的国际型能源技术服务商。
二、招聘对象：2027届应届毕业生
三、招聘岗位：工程师、调试工程师
四、专业需求：能源动力、电气、继电保护、高电压技术、热能动力、机械设计制造及自动化、自动化、测控技术与仪器、环境工程、应用化学等相关专业应届生
五、投递方式：手机端网申入口：${CEEC_TECH_URL}；扫描二维码投递简历；扫码进群获取更多信息。`;
  const HEIBAIDIAO_TEXT = `【黑白调 | 傲风】2027校招全球启动！
人体工学椅及电竞椅行业连续多年全国销售额/量第一。你加入的是定义者，不是追赶者。
岗位类型：产品研发、供应链、设计、运营销售、市场品牌、专业类等六大类岗位。
工作地点：杭州、深圳
招聘对象：2027届海内外应届毕业生
投递建议：尽早投递，招满即止；秋招刚开，HC最充足，越早投选择越多。先投先筛先面，简历会被最早处理。
投递后需在48小时内完成测评（约10分钟），测评是必经环节，完成后才可进入面试流程。
投递链接：${HEIBAIDIAO_URL}`;
  const HEIBAIDIAO_UPDATED_TEXT = `【傲风2027届校园招聘启动】
傲风 AutoFull——专业人体工学电竞椅品牌，深耕电竞与健康坐具领域多年，产品覆盖专业电竞椅、人体工学椅、升降桌等，远销全球100+国家和地区。
招聘岗位类别：产品类、设计类、电商运营类、市场营销类、供应链类、职能类。
细分方向：产品经理、工业设计、结构设计、视觉设计、电商运营、直播运营、品牌策划、新媒体运营、采购、计划、物流、质量、人力、财务等。
工作地点：杭州、上海、深圳、广州、东莞（部分岗位支持弹性办公）
招聘流程：网申/内推→简历筛选→测评/笔试（部分岗位）→面试（2-3轮）→Offer→签约入职
福利：五险一金、年终奖金、带薪年假、节日礼包、员工专属内购折扣、定期团建、完善培训体系。
招聘对象：2026年9月-2027年8月期间毕业的国内外应届生（本硕博均可）
网申链接直达：${HEIBAIDIAO_UPDATED_URL}
答疑群：${HEIBAIDIAO_GROUP_URL}`;
  const BJRCB_TEXT = `北京农商银行
微信公众号文章：${BJRCB_URL}`;
  const HUIJU_JINGCHENG_TEXT = `慧聚京诚
微信公众号文章：${HUIJU_JINGCHENG_URL}`;
  const BAIC_TEXT = `北汽集团
微信公众号文章：${BAIC_URL}`;
  const CRRC_ZHUZHOU_TEXT = `中车株洲所
微信公众号文章：${CRRC_ZHUZHOU_URL}`;
  const YEALINK_TEXT = `亿联网络 2027届校园招聘正式启动！
亿起成长，联动未来
厦门亿联网络技术股份有限公司（股票代码：300628）是全球领先的沟通与协作解决方案提供商，提供国际品质、技术领先、体验友好的云+端AI音视频会议、IP语音通信及协作解决方案，且与微软等国际品牌达成长期深度的战略合作。
招聘岗位：研发类、营销类、产品类
世界级行业龙头，提供广阔平台与坚实保障，薪酬福利优厚无忧。
投递简历：${YEALINK_URL}
专属推荐码：ESKJAB`;
  const INTCO_TEXT = `英科医疗 | 2027届校园招聘，做更好的自己！
英科医疗是一家致力于医疗器械耗材研发、生产、营销的高科技制造企业，于2017年7月在深交所上市，业务涵盖医用耗材、康复医疗器械、理疗护理等系列产品。
招聘岗位：研发、IT、营销、生产、职能
工作地点：淄博、潍坊、济南、青岛、镇江、淮北、安庆、九江、北京、上海、海外
福利待遇：15w-30w（具体根据岗位而定），五险一金、创新奖励、星级宿舍、自助餐厅
投递：${INTCO_URL}`;
  const STICS_TEXT = `【中景芯创27届校园招聘-专场宣讲会】
宣讲时间：9月9日 19:00-21:00
宣讲场地：逸夫楼401
此次宣讲会报名可优先面试，报名链接：${STICS_FORM_URL}
中景芯创致力于打造覆盖设计服务、封装制造全流程的一站式设计服务体系和先进封装研发与制造生产基地，充分发挥北京市在集成电路领域的产业基础与技术积淀，系统联动集成电路装备、关键材料、EDA工具、先进逻辑工艺制造、芯片设计等上下游关键资源，构建协同发展的集成电路产业生态。
招聘职位：技术研发类、工艺与制造类、质量与可靠性类、数字化与IT类、职能管理类
福利待遇：基本工资、轮班津贴、季度奖金、年终奖、住房补贴、餐补、加班费、五险一金、补充商业保险、带薪年假（法定+福利）、年度体检
网申地址：${STICS_URL}
现场有多轮抽奖活动。`;
  const ANT_GROUP_TEXT = `蚂蚁集团2027届秋季校园招聘已启动
我们期待遇见敢想敢做、热爱探索，对未来充满好奇与期待的同学。无论是技术、产品、运营、数据分析、风险管理或设计方向，都能在蚂蚁找到成长舞台。
招聘对象：2027届应届毕业生，毕业时间为2026年11月-2027年10月的海内外院校毕业生
招聘岗位：技术、产品、运营、数据、风险管理等
北京科技大学专属投递通道：${ANT_GROUP_URL}
提前锁定筛选机会，向心动Offer再近一步！`;
  const XINHECHENG_TEXT = `【现场宣讲】山东新和成控股有限公司
【宣讲时间】2026-9-9（本周三）19:00
【宣讲地点】机电信息楼616
【宣讲链接】${XINHECHENG_FAIR_URL}
【企业网申链接】${XINHECHENG_URL}
【企业简介】浙江新和成股份有限公司（股票代码002001）成立于1999年，2004年上市，位居中国精细化工百强第1位、中国上市公司百强。公司专注功能性化学品，业务覆盖营养品、香精香料、新材料、原料药等领域，在浙江、山东、黑龙江、天津建有五大生产基地，并在欧、美、东南亚设立分支机构，服务全球100多个国家和地区。拥有国家认定企业技术中心、博士后工作站（独立招收）等研发平台，获中国专利金奖2项、国家技术发明奖二等奖2项。现有员工超11000人，总资产500多亿元，2025年营收222.51亿元。
【需求专业】化学化工类、材料类、生物类、药学制药类、过程装备与控制类、自动化类、机械类、电气、土木等专业；其他专业均有匹配岗位！
【福利待遇】本科：13-15W；硕士：16.5-20+W；博士：一人一议；`;
  const BEIZI_TEXT = `北自科技
微信公众号文章：${BEIZI_URL}`;
  const TIAN_SUN_TEXT = `天隼实验室2027届校园招聘宣讲会-北京站
湖南省政府直属事业单位和新型研发机构
招聘对象：2027届应届博士、硕士研究生
所需专业：信息与通信工程、电子信息、计算机科学与技术、电子科学与技术、控制科学与工程、兵器科学与技术、管理科学与工程等相关专业
时间：2026年9月10日（周四）19:00
地点：中国科学院大学中关村校区N306（外校可进）
扫码报名：${TIAN_SUN_URL}
薪酬：博士35W起，硕士20W起，优秀人才一事一议
福利：人才公寓、生活补贴、实验室及长沙市购房补贴
说明：本场为北京站宣讲会，实际工作地点需以具体岗位信息为准。`;
  const CSIC_716_TEXT = `中船七一六所
微信公众号文章：${CSIC_716_URL}`;
  const RUIJIE_TEXT = `锐捷网络2027届校招启动！
企业简介：国有控股，深交所创业板上市301165，年复合增长30%，数字通信行业，8000人规模；中国200G/400G数据中心交换机市场份额第一，中国以太光网络市场份额第一，中国以太网交换机市场份额第三，中国企业级WLAN出货量第一。
招聘岗位：产品类、研发类、设计类、管培类、市场类、职能类、技服类
工作地点：福州市、北京市、成都市、南京市、上海市、深圳市、海外
招聘链接：${RUIJIE_URL}`;
  const FAMSUN_TEXT = `【丰尚2027届校园招聘｜高校专属内推通道开启】
国际化智能装备龙头｜500+校招岗位｜本硕博均可投
关于丰尚：总部江苏扬州，饲料&食品工程领域龙头企业；扬州、深圳、美国、德国四大研究院，海外33个代表处，产品销往100+国家；国家制造业单项冠军，承担“十四五”国家重点研发项目。
招聘岗位（2027届应届）：
研发类：产品设计、博士研发、自动化（PLC/嵌入式）、应用工程师
技术类：机械/电气/结构设计、IT、质量、服务工程师、解决方案经理
项目类：项目管理、项目计划
营销类：客户经理、商务支持、市场专员
职能类：财务、人力、采购、法务、品牌、造价、融资
覆盖机械、计算机、食品、电气、土木、财会、外语、生物、化工等多专业。
高校内推直达链接：${FAMSUN_URL}
答疑社群：${FAMSUN_GROUP_URL}`;
  const IWHALECLOUD_TEXT = `浩鲸科技2027届秋季校园招聘正式启动！
全球领先数智化全栈能力提供商，业务覆盖全球80+国家。
五大类岗位热招中：
核心研发（12-20万）：全栈、大模型、AI应用、嵌入式开发
数据算法（18-30万）：NLP、图像、语音、VLA、导航控制、强化学习、推理加速、数据挖掘
综合技术（10-22万）：云交付、测试、产品管培、国际交付、售前管培、项目管培、培训讲师
市场营销（20-30万）：全球销售管培生
职能支持（8-12万）：财务、人力资源专员
工作地点：南京、广州、长沙、福州、厦门、西安
答疑链接：${IWHALECLOUD_QA_URL}
内推链接：${IWHALECLOUD_URL}
内推码：EVV8SH`;
  const CNNC_404_TEXT = `中核四〇四
微信公众号文章：${CNNC_404_URL}`;
  const COGE_TEXT = `科捷智能2027届校园大使招聘
科捷智能（688455）是智能物流与智能制造上市企业，全球交付近1500个项目，现面向国内外高校招募校园大使。
职责：线上扩散校招资讯（朋友圈、就业群），推荐优秀应届生。
要求：全日制本科在校生，大二/大三/研一/研二优先；有校园人脉或社团、就业助理经验更佳；沟通力强，责任心重。
激励机制（多劳多得）：
国内985/211：简历通过5元/人，接受offer 200元/人，签三方1000元/人。
海外院校（不限排名）：接受offer 500元/人。
你将获得：现金奖励、上市企业校招实战经验、HR零距离指导、正规项目经历证明。
报名：联系秦经理17367037375（微信），名额有限，先到先得。
趁年轻，“科”劲儿造！加入科捷智能校园大使！`;
  const BANK_OF_CHINA_TEXT = `中国银行
微信公众号文章：${BANK_OF_CHINA_URL}`;
  const BAICHUAN_ORIGIN_TEXT = `百川智能「源点顶尖人才计划」正式启动！
面向全球顶尖校园人才，招募大模型核心技术与AI应用方向的应届生与实习生。
【面向人群】应届岗位：2025-2027年毕业的应届生；实习岗位：2027年毕业的在校生
【工作地点】北京
【招募方向】大模型算法、生命基础模型、AI Infra训练、AI Infra推理、Agent算法、AI产品经理
【投递链接】${BAICHUAN_ORIGIN_URL}
【内推码】SMHWHPM
加入“源点计划”，成为下一代智能的源点！`;
  const PAPEGAMES_TEXT = `叠纸游戏2027秋季校园招聘正式启动！
寻找热爱创作的你！
招聘岗位：技术研发、策划、美术、动画、市场运营、职能支持、音频类
应聘流程：网申—笔试—面试—offer
加入叠纸激发更多创作和成长：校招生专属人才发展计划；持续的带教支持；丰富的内外部创作分享；海量内部学习资源
投递简历：${PAPEGAMES_URL}`;
  const BOKE_UPDATED_TEXT = `波克2027届秋招网申启动啦！
想进游戏行业、互联网、做全球化精品游戏的同学看过来。
关于波克：波克成立于2010年，全球注册用户超5亿。多款产品进入微信小游戏、抖音小游戏头部阵营，日活跃用户超3000万。连续7年入选中国互联网百强企业，研发和技术人员占比60%以上，AI全线赋能，累计自主知识产权2000余项。
岗位方向覆盖：技术、美术、产品、发行、职能，包括算法、开发、UI、原画、AI产品经理、游戏策划、用户增长、视频设计、海外资金管理、法律合规等方向。
投递简历：${BOKE_UPDATED_URL}`;
  const SHEIN_TEXT = `SHEIN希音27届秋招火热进行中！港交所上市企业
21-25年购物类APP下载量TOP2，服务全球超150个国家和地区，《时代》杂志全球最具影响力企业百强。
面向人群：2027届海内外应届毕业生
校招岗位：
信息技术类：后端、算法、产品、APP研发、数据分析等
商品平台类：设计师、买手、企划、招商等
服装供应链类：管培生、服装质量、供应商管理、成本管控等
国际物流与仓储类：管培生、国际物流、质量管理等
职能管理类：财务、项目管理等
全球运营类：电商平台治理、平台商家管理等
投递链接：${SHEIN_URL}`;
  const TUHU_TEXT = `关于途虎：途虎养车是中国领先的线上线下一体化汽车服务平台，2011年于上海成立
工作城市：上海、武汉
开放岗位：算法、全栈开发工程师、产品、运营、硬件工程师等多类岗位
岗位投递：${TUHU_URL}`;
  const RELIANCE_METALS_TEXT = `热联集团2027届校园招聘正式启动！
热联集团成立于1997年，是国有控股的大宗商品产业服务商，业务覆盖钢材、化工、原料、农产品等品种，并持续拓展全球化产业服务网络。
招聘对象：2027届国内外高校本科生、硕士生
招聘岗位：大宗商品期货专员、商务专员、业务管培生等
工作城市：杭州
投递链接：${RELIANCE_METALS_URL}
（点击链接，选择对应岗位投递；当天投递，内推处理效率更高！）`;
  const CASIC_TEXT = `逐梦航天，强国有我——中国航天科工2027届校园招聘全面启动！
中国航天科工是我国航天事业和国防科技工业的中坚力量，是战略性、高科技、创新型中央骨干企业，拥有覆盖多地的科研生产与创新平台。
招聘对象：2027届高校毕业生
招聘方向：航空宇航、电子信息、计算机、自动化、机械、材料及职能管理等
工作城市：北京、武汉、深圳、南京、呼和浩特等
投递链接：${CASIC_URL}
（点击链接，选择对应岗位投递；当天投递，内推处理效率更高！）`;
  const FUNPLUS_TEXT = `FunPlus2027届校招
多种岗位：技术类、策划类、美术类、发行类、运营类、用研/行研类
面向对象：27届校招、28届实习
工作城市：北京、成都
投递方式：${FUNPLUS_URL}`;
  const UNISOC_TEXT = `紫光展锐27届秋招正式批已启动！
⭐【公司简介】平台型芯片设计企业，产品覆盖移动通信、物联网和智能终端等应用领域。
📌【招聘对象】2027届相关专业高校毕业生
📌【工作地点】以具体岗位页面为准
📌【热招岗位】芯片、硬件、软件开发、算法、测试开发、产品及供应链等方向
【投递链接】${UNISOC_URL}
（添加微信，后台回复「紫光展锐」，可获得投递链接，同时可获得免费秋招、实习岗位表格和海量求职资料，每日更新！机会不容错过）
【27秋招交流群】${UNISOC_GROUP_URL}
（请在微信或企业微信中打开链接加入群聊）`;
  const ECOVACS_TEXT = `科沃斯机器人股份有限公司校园招聘进行中！
科沃斯是专业从事家用机器人研发、设计、制造和销售的企业，在德、美、日设销售子公司，业务覆盖60多个国家和地区，长期占据国内清洁机器人市场较高份额。
招聘对象：2027届本硕博应届毕业生
招聘岗位：产品工程师、工业工程师、算法工程师、品牌专员、电商运营、人事专员等
工作城市：深圳、苏州
投递链接：${ECOVACS_URL}
（经验中选择“应届生”投递；注册后当天完成投递，内推处理效率更高！）`;
  const KE_TEXT = `贝壳 2027 届 ADC 校招正式启动
居住产业互联网大厂；校招+定向实习双通道；研发、算法、产品、运营、业务、职能多类岗位开放。
1v1导师带教，免费三餐饮料畅饮，实习优秀可转正；27届同学可冲，每人限投1岗。
学校专属推荐码：EZ9GTB
投递链接：${KE_URL}`;
  const AEROSPACE208_TEXT = `航天208所
微信公众号文章：${AEROSPACE208_URL}`;
  const AFTERSHOKZ_TEXT = `韶音科技2027届校园招聘启动！
企业介绍：骨传导耳机领导者，连续三年全球开放式耳机品牌出货量第一，产品进驻60+国家；深耕声学器件、助听器、算法、MEMS和大健康五大方向。
企业文化：倡导工作生活平衡，拒绝内卷，拒绝996；反对形式主义加班，强调运动和认知升级。每年投入百万运营21个运动俱乐部，鼓励员工参与运动，健康生活。
招聘岗位：研究类、开发类、产品类、工程技术类、品质管理类、IT类、营销运营类、设计策划类、供应链运营类、职能类等100+岗位。
薪酬福利：极具竞争力的薪资，租房补贴，校招生公寓，免费健身房，季度团建经费，21个运动俱乐部等。
工作城市：深圳、香港、武汉
内推链接：${AFTERSHOKZ_URL}
内推码：DSpVM7fP
27届校招答疑：${AFTERSHOKZ_QA_URL}
内推简历优先筛选，后续有疑问欢迎联系！`;
  const TCL_INDUSTRIES_TEXT = `TCL2027届校园招聘启动；生而不凡，敢为向上
（TCL实业和TCL华星光电互相独立）
【关于TCL实业】TCL实业聚焦智能终端业务，主要涵盖显示、智能家电、创新业务及家庭互联网等全品类智能消费电子产品及服务，同时大力发展环保科技、产业园运营、智能制造、产业金融等其他业务。
招聘岗位：研发技术类、产品设计类、市场营销类、智能制造类、供应链类、财务金融类、综合管理类
投递链接（请用PC端打开）：${TCL_INDUSTRIES_URL}
实业内推码：vzatho（填写内推码简历优先筛选）`;
  const TCL_CSOT_TEXT = `TCL2027届校园招聘启动；生而不凡，敢为向上
（TCL实业和TCL华星光电互相独立）
【关于TCL华星光电】TCL华星成立于2009年，是一家专注于半导体显示领域的创新型科技企业。华星将以“成为全球领先的显示解决方案提供商”为愿景，以领先科技和极致体验，共创洞见万物的未来显示。
华星内推码：uiqrxh（填写内推码简历优先筛选）
投递链接：${TCL_CSOT_URL}`;
  const state = { jobs: [], drafts: [], queueIds: [], queueIndex: 0 };
  const $ = (id) => document.getElementById(id);
  const HUNDSUN_TEXT = `恒生电子2027校园招聘开启
【关于恒生】恒生电子（600570.SH）是一家以“让金融变简单”为使命的金融科技公司，总部位于杭州，成立于1995年。公司服务超过3500家金融行业客户，连续18年入选FinTech100全球金融科技百强榜单。面向AI时代，恒生正加速向AI金融科技公司转型，推动技术架构、产品体系、开放生态等的代际升级，共创数智金融新未来
【招聘岗位】
AI方向——AI应用开发、智能体开发、模型后训练；软件开发——JAVA、C/C++、FPGA；软件测试——测试开发、软件测试；技术支持——交付、维护、运维；其他——销售、金融业务研究、需求分析；恒生拥有国家级博士后科研工作站，同时开设博士和博士后岗位招聘
【福利成长】专属导师辅导/高潜应届生培养/多通道发展/海量学习资源.....助你成长；带薪年假/员工餐厅/年度体检/多元社团/运动场馆/EAP项目......各类福利等你来。现在把这个加进去
投递简历：https://campus.hundsun.com/campus/jobs
专属推荐码：EZBA8V`;

  const seedJobs = [
    makeJob({company:'星河智能',title:'算法工程师（AI方向）',city:'北京',salary:'20-35K/月',url:'https://example.com/xinghe-ai',deadline:'2026-10-31',type:'校招',tags:['AI/Agent'],priority:'S',match:92,raw:'星河智能 2027 校招\n岗位：算法工程师（AI方向）\n地点：北京\n薪资：20-35K/月\n网申：https://example.com/xinghe-ai\n截止日期：2026-10-31',isExample:true}),
    makeJob({company:'华控科技',title:'电机控制算法工程师',city:'上海',salary:'18-30K/月',url:'https://example.com/huakong-control',deadline:'2026-11-15',type:'校招',tags:['电机/控制'],priority:'A',match:88,raw:'华控科技招聘\n岗位：电机控制算法工程师\n工作地点：上海\n薪资：18-30K/月\n投递链接：https://example.com/huakong-control\n截止：2026-11-15',isExample:true}),
    makeJob({company:'远航汽车',title:'智能驾驶实习生',city:'深圳',salary:'250-350/天',url:'https://example.com/yuanhang-intern',deadline:'2026-09-30',type:'实习',tags:['AI/Agent'],priority:'B',match:76,raw:'远航汽车实习招聘\n职位：智能驾驶实习生\n城市：深圳\n薪资：250-350/天\n网申：https://example.com/yuanhang-intern\n报名截止：2026-09-30',isExample:true})
  ];

  function makeJob(data = {}) {
    const job = {id: data.id || cryptoId(), company:'', title:'', city:'', salary:'', url:'', urls:[], deadline:'', type:'校招', source:'群聊粘贴', raw:'', raw_text:'', linkParseStatus:'待解析', status:'待筛选', tags:[], match:'', resume:'都可以', priority:'B', gptSuggestion:'', notes:'', isExample:false, createdAt:Date.now(), updatedAt:Date.now(), ...data};
    job.raw = data.raw ?? data.raw_text ?? job.raw;
    job.raw_text = data.raw_text ?? job.raw;
    job.url = data.url ?? (Array.isArray(data.urls) ? data.urls.join('\n') : job.url);
    job.urls = Array.isArray(data.urls) ? data.urls.filter(Boolean) : String(job.url || '').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    job.url = job.urls.join('\n');
    job.linkParseStatus = LINK_STATUSES.includes(job.linkParseStatus) ? job.linkParseStatus : (job.urls.length ? '已解析' : '待解析');
    job.tags = Array.isArray(job.tags) ? job.tags.filter(Boolean) : [];
    return job;
  }
  function cryptoId() { return 'job-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8); }
  function esc(value) { return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function normalize(value) { return String(value || '').toLowerCase().replace(/[\s\-—_，。、“”‘’：:（）()【】\[\]]/g,''); }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify({version:1,jobs:state.jobs,savedAt:new Date().toISOString()})); }
  function saveFilters() {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify({
      company:$('companyFilter').value,
      city:$('cityFilter').value,
      keyword:$('keywordFilter').value,
      status:$('statusFilter').value,
      tag:$('tagFilter').value
    }));
  }
  function restoreFilters() {
    try {
      const filters = JSON.parse(localStorage.getItem(FILTER_STORAGE_KEY) || 'null');
      if (!filters) return;
      $('companyFilter').value = filters.company || '';
      $('cityFilter').value = filters.city || '';
      $('keywordFilter').value = filters.keyword || '';
      $('statusFilter').value = filters.status || '';
      $('tagFilter').value = filters.tag || '';
    } catch {}
  }
  function load() {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      state.jobs = Array.isArray(stored?.jobs) ? stored.jobs.map(makeJob) : seedJobs;
      repairShopeeFragments();
    } catch { state.jobs = seedJobs; }
    addPendingHundsun();
    addPendingAmpace();
    addPendingShengtong();
    addPendingObsbot();
    addPendingHytera();
    addPendingQunhe();
    addPendingSmartsens();
    addPendingKtc();
    addPendingWoan();
    addPendingEnvision();
    mergeEnvisionUpdate();
    addPendingChtGroup();
    addPendingCrrcTangshan();
    addPendingBoe();
    addPendingCscec8bNewBuild();
    addPendingLeadvision();
    addPendingSaic();
    addPendingChangchuan();
    addPendingGbits();
    addPendingHollyland();
    addPendingMidea();
    addPendingZuru();
    addPendingNeuehct();
    addPendingHuayou();
    addPendingQdzh();
    addPendingScc();
    addPendingCscec3bInnovation();
    addPendingFutech();
    addPendingGree();
    mergeGreeUpdate();
    addPendingCnki();
    mergeSfAutoUpdate();
    mergeJiachenUpdate();
    addPendingShanghaiHuali();
    addPendingNewOriental();
    addPendingTavern();
    addPendingLuster();
    addPendingCctc();
    addPendingHellotech();
    mergeHellotechUpdate();
    mergeHellotechRecommendUpdate();
    addPendingCfMoto();
    addPendingLeapmotor();
    addPendingVisionox();
    addPendingAnker();
    addPendingQyxdl();
    addPendingMetax();
    addPendingSunwoda();
    addPendingReo();
    mergePendingReoUpdate();
    addPendingCainiao();
    addPendingFandow();
    addPendingHikvision();
    addPendingUbtech();
    addPendingTplinkGlobal();
    addPendingTplinkCn();
    addPendingMoonton();
    addPendingCvte();
    addPendingSzkingdom();
    addPendingHoymile();
    addPendingChangyou();
    addPendingQunar();
    addPendingTaisting();
    addPendingDfWeston();
    addPendingIrobotics();
    addPendingAmec();
    addPendingLiulian();
    addPendingHisenseIm();
    addPendingHisensePoster();
    addPendingHorizon();
    mergeHorizonAutumnUpdate();
    addPendingEmdoor();
    addPendingKelong();
    addPendingSpeech();
    addPendingCetc55();
    addPendingZhuoyu();
    addPendingBoke();
    addPendingHangtianDadao();
    addPendingManbang();
    addPendingHuaweiWireless();
    addPendingGiti();
    addPendingWanneng();
    addPendingGeekplus();
    addPendingRongzhi();
    addPendingZhplus();
    addPendingDescente();
    mergeIroboticsUpdate();
    addPendingChipsea();
    addPendingJee();
    addPendingNinebot();
    addPendingUnilumin();
    addPendingCasc();
    addPendingCmb();
    addPendingLeihu();
    addPendingXuzhiyuan();
    addPendingCitic();
    addPendingZte();
    addPendingYongzhuo();
    addPendingNorthernIc();
    addPendingBjSpaceTest();
    addPendingSgmw();
    addPendingCisdi();
    addPendingAerodynamics();
    addPendingGuangqi();
    addPendingRonbay();
    addPendingSgs();
    addPendingCiic();
    addPendingWaterdrop();
    addPendingYotta();
    addPendingOppo();
    addPendingFanruan();
    addPendingChinaNorinco();
    addPendingRuankong();
    mergeRuankongUpdate();
    addPendingSuzhouXuchuang();
    addPendingHesai();
    addPendingHirain();
    addPendingSilan();
    addPendingZhongweiSemicon();
    addPendingCeecTech();
    addPendingHeibaidiao();
    mergeHeibaidiaoUpdate();
    addPendingBjrcb();
    addPendingHuijuJingcheng();
    addPendingBaic();
    addPendingCrrcZhuzhou();
    addPendingYealink();
    addPendingIntco();
    mergeIntcoUpdate();
    addPendingIntcoPoster();
    addPendingSany();
    addPendingStics();
    addPendingAntGroup();
    addPendingXinhecheng();
    addPendingSept9Fairs();
    addPendingBeizi();
    addPendingTianSun();
    addPendingCsic716();
    addPendingRuijie();
    addPendingFamsun();
    addPendingIwhalecloud();
    addPendingCnnc404();
    addPendingCoge();
    addPendingBankOfChina();
    addPendingBaichuanOrigin();
    addPendingPapegames();
    mergeBokeUpdate();
    addPendingShein();
    addPendingTuhu();
    addPendingRelianceMetals();
    addPendingCasic();
    addPendingFunplus();
    addPendingUnisoc();
    addPendingEcovacs();
    mergeRongzhiUpdate();
    addPendingKe();
    addPendingAerospace208();
    addPendingAftershokz();
    addPendingTclIndustries();
    addPendingTclCsot();
    repairSept9FairDuplicates();
    mergeXinhechengCurrentUpdate();
    addPendingSuzhouDay();
    addPendingAac();
    addPendingSinexcel();
    addPendingHkaco();
    addPendingBlueinteractive();
    addPendingStreamax();
    addPendingTinci();
    addPendingSfAuto();
    addPendingGuangmingTalent();
    addPendingSept10Events();
    addPendingHongwang();
    addPendingSmartlogic();
    addPendingUniversityRecruitment();
    addPendingTorras();
    addPendingTauren();
    addPendingPinganLife();
    addPendingNovosns();
    addPendingSmic();
    addPendingUisee();
    mergeQunarUpdate();
    addPendingHuolala();
    addPendingChangshaMining();
    addPendingSankeTree();
    addPendingLiyang();
    mergeLiyangFair();
    addPendingIoptFair();
    addPendingSuzhouFair();
    addPendingSept14Fairs();
    mergeMammotionUpdate();
    addPendingLenovo();
    addPendingXiaohongshu();
    addPendingEcoflow();
    mergeTuhuUpdate();
    addPendingCscecInternational();
    addPendingSugon();
    addPendingKehuaData();
    addPendingSept15Fairs();
    addPendingSpaceT1();
    addPendingEaspring();
    addPendingCnncZhongyuan();
    addPending37Interview();
    mergeHoymileUpdate();
    addPendingGeely();
    addPendingPinganPension();
    addPendingPinganBank();
    addPendingCrrcGroup();
    addPendingHaiyiSoftware();
    addPendingFotile();
    addPendingHonggong();
    addPendingGoodwe();
    addPendingSept16Fairs();
    addPendingShanghaiPowerInstall();
    addPendingJaten();
    addPendingSunshineInsurance();
    addPendingToutiao();
    mergeSeresUpdate();
    mergeCisdiUpdate();
    addPendingZtsteel();
    addPendingYadea();
    addPendingSpringAirlines();
    addPendingCaterpillar();
    addPendingTbea();
    addPendingYutong();
    addPendingSmartmore();
    addPendingKnightGroup();
    addPendingImou();
    addPendingMultifields();
    addPendingTaikang();
    addPendingTranssion();
    addPendingSpdbChangsha();
    addPendingBluefocus();
    addPendingYaoPin();
    addPendingDataInstitute();
    addPendingCscec4Install();
    addPendingHonorBeike();
    addPendingKingsoftGame();
    addPendingFotonRi();
    addPendingQxgyWechat();
    addPendingXcmg();
    addPendingShantui();
    addPendingCcsGuangdong();
    addPendingOpple();
    addPendingIntime();
    addPendingCarizon();
    addPendingSgmicroBeijing();
    addPendingJoyin();
    addPendingNfc();
    addPendingH3c();
    addPendingSmoore();
    mergeKtcRecommendUpdate();
    addPendingGreeElectronics();
    addPendingAlibabaLingxi();
    addPendingQianli();
    addPendingSupcon();
    addPendingNovastar();
    addPendingHunanTalentFair();
    addPendingRootGlobal();
    addPendingWondershare();
    addPendingSept23Fairs();
    addPendingYstNfsWantai();
    repairKtcLinks();
    if (!stored) save();
    if (!state.jobs.length && !localStorage.getItem(STORAGE_KEY)) state.jobs = seedJobs;
    restoreFilters();
    render();
  }
  function repairShopeeFragments() {
    const hasCompleteShopee = state.jobs.some(j => j.company === 'Shopee' && getUrls(j).length > 0);
    if (!hasCompleteShopee) return;
    const before = state.jobs.length;
    state.jobs = state.jobs.filter(j => {
      if (getUrls(j).length > 0) return true;
      const text = `${j.company || ''}\n${j.title || ''}\n${j.raw || ''}`;
      const title = String(j.title || '').trim();
      const shopeeFragment = (j.company === 'Shopee' || j.company === '待确认') && (text.includes('Shopee') || /^待确认$/.test(title) || /^\s*(?:对象|流程|薪资)[】\]]/.test(title) || /^研发\s*\|\s*产品/.test(title) || /招聘对象|招聘流程|岗位方向|工作地点|岗位薪资|假期多多/.test(text));
      return !shopeeFragment;
    });
    if (state.jobs.length !== before) save();
  }
  function addPendingHundsun() {
    if (localStorage.getItem(PENDING_HUNDSUN_KEY)) return;
    const urls = extractUrls(HUNDSUN_TEXT);
    const job = makeJob({company:'恒生电子',title:'AI方向 / 软件开发 / 软件测试 / 技术支持 / 其他（含博士、博士后岗位）',city:'杭州（总部；工作地点未注明）',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HUNDSUN_TEXT,raw_text:HUNDSUN_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'专属推荐码：EZBA8V'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HUNDSUN_KEY, '1');
    save();
  }
  function addPendingAmpace() {
    if (localStorage.getItem(PENDING_AMPACE_KEY)) return;
    const job = makeJob({company:'Ampace',title:'2027 全球校园招聘（微信文章）',city:'',salary:'',url:AMPACE_URL,urls:[AMPACE_URL],linkParseStatus:'需人工打开',type:'校招',source:'微信公众号',raw:'新能源2027全球校园招聘正式启动！\n微信公众号文章：' + AMPACE_URL,raw_text:'新能源2027全球校园招聘正式启动！\n微信公众号文章：' + AMPACE_URL,status:'待筛选',notes:'企业名称依据招聘卡片可见的 Ampace 文案暂填，请人工打开文章确认具体岗位。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_AMPACE_KEY, '1');
    save();
  }
  function addPendingShengtong() {
    if (localStorage.getItem(PENDING_SHENGTONG_KEY)) return;
    const job = makeJob({company:'晟通集团',title:'2027 届接班人计划校园招聘（微信文章）',city:'',salary:'',url:SHENGTONG_URL,urls:[SHENGTONG_URL],linkParseStatus:'需人工打开',type:'校招',source:'微信公众号',raw:'晟通集团 2027 届接班人计划校园进行时！\n微信公众号文章：' + SHENGTONG_URL,raw_text:'晟通集团 2027 届接班人计划校园进行时！\n微信公众号文章：' + SHENGTONG_URL,status:'待筛选',notes:'具体岗位和地点请人工打开微信公众号文章确认。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SHENGTONG_KEY, '1');
    save();
  }
  function addPendingObsbot() {
    if (localStorage.getItem(PENDING_OBSBOT_KEY)) return;
    const job = makeJob({company:'OBSBOT 寻影',title:'2027 届秋季校园招聘（多岗位方向）',city:'深圳、成都、杭州、西安',salary:'',url:OBSBOT_URL,urls:[OBSBOT_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:OBSBOT_TEXT,raw_text:OBSBOT_TEXT,status:'待筛选',notes:'热招岗位：算法类、软件类、硬件类、产品类、测试&项目管理类、销售类、管培生类。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_OBSBOT_KEY, '1');
    save();
  }
  function addPendingHytera() {
    if (localStorage.getItem(PENDING_HYTERA_KEY)) return;
    const job = makeJob({company:'海能达',title:'2027 届校园招聘（技术 / 产品 / 设计 / 职能 / 市场 / 供应链）',city:'深圳、东莞等多地',salary:'算法/海外营销 14-22K；硬件开发 14-21K；软件开发 12-20K；国内营销 10-15K；部分岗位最高 30K/月',url:HYTERA_URL,urls:[HYTERA_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HYTERA_TEXT,raw_text:HYTERA_TEXT,status:'待筛选'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HYTERA_KEY, '1');
    save();
  }
  function addPendingQunhe() {
    if (localStorage.getItem(PENDING_QUNHE_KEY)) return;
    const job = makeJob({company:'群核科技',title:'2027 届秋招 / 储备实习生（科研算法、AI Infra、产品经理）',city:'杭州',salary:'',url:QUNHE_URL,urls:[QUNHE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:QUNHE_TEXT,raw_text:QUNHE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：DSzzee3A；同时开放 27 届校招生和储备实习生岗位；星核人才计划欢迎博士投递。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_QUNHE_KEY, '1');
    save();
  }
  function addPendingSmartsens() {
    if (localStorage.getItem(PENDING_SMARTSENS_KEY)) return;
    const job = makeJob({company:'思特威电子科技',title:'2027 届秋季校园招聘（多岗位方向）',city:'',salary:'',url:SMARTSENS_URL,urls:[SMARTSENS_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SMARTSENS_TEXT,raw_text:SMARTSENS_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'热招岗位：数字/模拟电路设计、数字后端、图像算法、AI 芯片软件、像素验证/仿真、平台验证、软件开发、项目管理、技术支持、供应链等。具体工作地点原文未注明。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SMARTSENS_KEY, '1');
    save();
  }
  function addPendingKtc() {
    if (localStorage.getItem(PENDING_KTC_KEY)) return;
    const job = makeJob({company:'康冠科技',title:'2027 届秋季校园招聘（技术研发 / 产品设计 / 市场运营）',city:'',salary:'',url:KTC_URL,urls:[KTC_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:KTC_TEXT,raw_text:KTC_TEXT,status:'待筛选',notes:'推荐码：EVVPT9（填写推荐码简历优先筛选）；原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_KTC_KEY, '1');
    save();
  }
  function addPendingWoan() {
    if (localStorage.getItem(PENDING_WOAN_KEY)) return;
    const job = makeJob({company:'卧安机器人（OneRobotics）',title:'2027 届秋季校园招聘（算法工程师 / 运营管培生 / 人力资源专员）',city:'',salary:'',url:WOAN_URL,urls:[WOAN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:WOAN_TEXT,raw_text:WOAN_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：EVKR08；热招岗位：算法工程师、运营管培生、人力资源专员；原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_WOAN_KEY, '1');
    save();
  }
  function addPendingEnvision() {
    if (localStorage.getItem(PENDING_ENVISION_KEY)) return;
    const urls = [ENVISION_URL, ENVISION_GROUP_URL, ENVISION_COLLECTION_URL];
    const job = makeJob({company:'远景能源',title:'2027 届秋季校园招聘（研发 / 产品 / 工艺 / 制造 / 供应链 / 质量 / 市场与解决方案 / 工程 / 设计 / 项目 / 职能）',city:'全国；海外多地区',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ENVISION_TEXT,raw_text:ENVISION_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'内推码：DSZbCUVQ；本次内推项目仅针对远景能源岗位；主投递链接可筛选业务部门“远景能源”，原文称共146个岗位；秋招交流群：663984497。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ENVISION_KEY, '1');
    save();
  }
  function mergeEnvisionUpdate() {
    if (localStorage.getItem(PENDING_ENVISION_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('远景能源') || getUrls(j).some(url => url.includes('envisiongroup')));
    if (!job) {
      const newJob = makeJob({company:'远景能源',title:'2027 届秋招正式批（13大类别 / 140+岗位）',city:'全国；海外多地区',salary:'',url:ENVISION_UPDATED_URL,urls:[ENVISION_UPDATED_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ENVISION_UPDATED_TEXT,raw_text:ENVISION_UPDATED_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：DSF3U2Kz；原文未明确具体薪资。'});
      if (!isDuplicate(newJob)) state.jobs.unshift(newJob);
    } else {
      const urls = getUrls(job);
      if (!urls.includes(ENVISION_UPDATED_URL)) urls.push(ENVISION_UPDATED_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '远景能源';
      job.title = '2027 届秋招正式批（13大类别 / 140+岗位）';
      job.city = '全国；海外多地区';
      job.type = '校招';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充招聘消息 ---\n${ENVISION_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充正式批信息：13大类别、140+岗位；新增推荐码DSF3U2Kz及正式批投递链接。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_ENVISION_UPDATE_KEY, '1');
    save();
  }
  function addPendingChtGroup() {
    if (localStorage.getItem(PENDING_CHT_GROUP_KEY)) return;
    const job = makeJob({company:'扬腾创新',title:'2027 届精英计划（算法 / 战略 / 供应链 / 运营 / 技术研发）',city:'',salary:'顶尖人才年薪可达100W',url:CHT_GROUP_URL,urls:[CHT_GROUP_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CHT_GROUP_TEXT,raw_text:CHT_GROUP_TEXT,status:'待筛选',notes:'不限专业；推荐码：EV3MVV；福利包含六险一金、人才补贴、人才公寓、年终奖和双通道晋升；原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CHT_GROUP_KEY, '1');
    save();
  }
  function addPendingCrrcTangshan() {
    if (localStorage.getItem(PENDING_CRRCTANGSHAN_KEY)) return;
    const job = makeJob({company:'中车唐山机车车辆有限公司',title:'2027 届校园招聘宣讲会',city:'',salary:'',url:CRRC_TANGSHAN_FAIR_URL,urls:[CRRC_TANGSHAN_FAIR_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CRRC_TANGSHAN_FAIR_TEXT,raw_text:CRRC_TANGSHAN_FAIR_TEXT,status:'待筛选',notes:'宣讲时间：2026-09-08 13:30-15:00；地点：冶金楼616安耐克报告厅；面向硕士；该时间为宣讲会时间，不作为岗位截止日期。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CRRCTANGSHAN_KEY, '1');
    save();
  }
  function addPendingBoe() {
    if (localStorage.getItem(PENDING_BOE_KEY)) return;
    const job = makeJob({company:'京东方',title:'Hi YOU 2027 届全球校园招聘宣讲会',city:'',salary:'',url:BOE_FAIR_URL,urls:[BOE_FAIR_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:BOE_FAIR_TEXT,raw_text:BOE_FAIR_TEXT,status:'待筛选',notes:'宣讲时间：2026-09-08 19:00-21:00；地点：教职工礼堂；面向本科、硕士、博士；该时间为宣讲会时间，不作为岗位截止日期。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BOE_KEY, '1');
    save();
  }
  function addPendingCscec8bNewBuild() {
    if (localStorage.getItem(PENDING_CSCEC8B_NEW_BUILD_KEY)) return;
    const job = makeJob({company:'中建八局新型建造工程有限公司',title:'2027 届校园招聘（博士管培生 / 新业务 / 工程技术 / 职能管理）',city:'全国（总部上海；具体工作地域按组织安排）',salary:'',url:CSCEC8B_NEW_BUILD_URL,urls:[CSCEC8B_NEW_BUILD_URL],linkParseStatus:'已解析',type:'校招',source:'PDF附件',raw:CSCEC8B_NEW_BUILD_TEXT,raw_text:CSCEC8B_NEW_BUILD_TEXT,status:'待筛选',notes:'2027届应届毕业生，本科及以上；需通过中建测评并接受工作地域分配；福利含五险一金、补充公积金、企业年金、项目免费食宿、落户上海等；面试沟通QQ群：1108615105。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CSCEC8B_NEW_BUILD_KEY, '1');
    save();
  }
  function addPendingLeadvision() {
    if (localStorage.getItem(PENDING_LEADVISION_KEY)) return;
    const job = makeJob({company:'北京领视智联科技有限公司',title:'2027 届校园招聘（技术支持 / 销售 / 软件研发 / 电气 / 机械设计 / 装调 / 光学）',city:'全国；北京、青岛；华东、华南、东北、华北等区域',salary:'',url:LEADVISION_URL,urls:[],linkParseStatus:'待解析',type:'校招',source:'PDF附件',raw:LEADVISION_TEXT,raw_text:LEADVISION_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'共7个岗位；技术支持全国可选，软件/电气/机械设计主要在北京、青岛，装调在青岛，光学在北京，销售覆盖华东/华南/东北/华北等区域；简历邮箱：liweifu@leadvisioninc.com；联系人：付经理13381383395（同微信）；简章未提供可复制网申URL。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_LEADVISION_KEY, '1');
    save();
  }
  function addPendingSaic() {
    if (localStorage.getItem(PENDING_SAIC_KEY)) return;
    const job = makeJob({company:'上汽集团',title:'待确认（微信文章）',city:'',salary:'',url:SAIC_URL,urls:[SAIC_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:SAIC_TEXT,raw_text:SAIC_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SAIC_KEY, '1');
    save();
  }
  function addPendingChangchuan() {
    if (localStorage.getItem(PENDING_CHANGCHUAN_KEY)) return;
    const job = makeJob({company:'杭州长川科技股份有限公司',title:'2027 届校园招聘（硬件 / 软件算法 / 控制算法 / AI / 测试 / 产品 / 供应链等）',city:'杭州、上海、成都、哈尔滨、武汉、内江、常州、北京、苏州、南京、诸暨、泉州、江阴等',salary:'基本工资+绩效工资+补贴/其他奖励；年终奖上不封顶',url:'',urls:[],linkParseStatus:'待解析',type:'校招',source:'PDF附件',raw:CHANGCHUAN_TEXT,raw_text:CHANGCHUAN_TEXT,status:'待筛选',tags:['AI/Agent','电机/控制'],notes:'2027届全日制应届本科及以上；岗位包含AI基础设施、AI开发、AI仿真、深度学习算法、控制算法（电机方向）等；简历邮箱：changchuanhr10@hzcctech.cn；请关注“长川科技招聘”公众号扫码投递；PDF未提供可复制网申 URL。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CHANGCHUAN_KEY, '1');
    save();
  }
  function addPendingGbits() {
    if (localStorage.getItem(PENDING_GBITS_KEY)) return;
    const job = makeJob({company:'吉比特&雷霆游戏',title:'2027 届秋季校园招聘（策划 / 研发 / 美术 / 产品运营 / 市场 / 公共职能）',city:'深圳、厦门',salary:'年底双薪+年终奖；每月房补；12%公积金；其他福利以岗位和公司政策为准',url:GBITS_URL,urls:[GBITS_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:GBITS_TEXT,raw_text:GBITS_TEXT,status:'待筛选',notes:'推荐码：U1R56F；旗下游戏包括《问道》《问道手游》《一念逍遥》《奥比岛：梦想国度》等；不限专业。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_GBITS_KEY, '1');
    save();
  }
  function addPendingHollyland() {
    if (localStorage.getItem(PENDING_HOLLYLAND_KEY)) return;
    const job = makeJob({company:'HOLLYLAND昊一源',title:'2027 届校园招聘（算法 / 软硬件研发 / 产品 / 营销 / 职能）',city:'深圳、武汉',salary:'',url:HOLLYLAND_URL,urls:[HOLLYLAND_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HOLLYLAND_TEXT,raw_text:HOLLYLAND_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：EV3M83；福利包括双休、六险一金、6个月免费公寓住宿、双导师带教及专业/管理双晋升通道。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HOLLYLAND_KEY, '1');
    save();
  }
  function addPendingMidea() {
    if (localStorage.getItem(PENDING_MIDEA_KEY)) return;
    const urls = [MIDEA_REFERRAL_URL, MIDEA_OFFICIAL_URL];
    const job = makeJob({company:'美的集团',title:'2027 届校园招聘（研发技术 / 信息技术 / 制造技术 / 供应链物流 / 营销 / 财务金融 / 综合管理）',city:'',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:MIDEA_TEXT,raw_text:MIDEA_TEXT,status:'待筛选',notes:'推荐码：MX6344；内推通道与官方校招地址均已保留；校招交流群QQ群：1108539480；原文未明确具体工作地点和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_MIDEA_KEY, '1');
    save();
  }
  function addPendingZuru() {
    if (localStorage.getItem(PENDING_ZURU_KEY)) return;
    const urls = [ZURU_URL, ZURU_QA_URL];
    const job = makeJob({company:'ZURU',title:'2027 届校园招聘（商科 / 创意 / 设计 / 研发 / 制造）',city:'广州、上海、深圳、东莞、惠州、中山',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ZURU_TEXT,raw_text:ZURU_TEXT,status:'待筛选',notes:'内推码：smwkew；内推链接和答疑交流文档均已保留；福利包含六险一金、包吃住、双休等；原文未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ZURU_KEY, '1');
    save();
  }
  function addPendingNeuehct() {
    if (localStorage.getItem(PENDING_NEUEHCT_KEY)) return;
    const job = makeJob({company:'智驾新程 neueHCT',title:'校园招聘（测试 / 软件 / 算法 / 项目管理 / 系统 / 硬件 / 质量）',city:'上海、北京、南京',salary:'',url:NEUEHCT_URL,urls:[NEUEHCT_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:NEUEHCT_TEXT,raw_text:NEUEHCT_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'欧摩威集团与地平线合资组建；福利包含六险一金、公积金12%、带薪年假、全薪病假、租房补贴等；原文未明确应届届别和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_NEUEHCT_KEY, '1');
    save();
  }
  function addPendingHuayou() {
    if (localStorage.getItem(PENDING_HUAYOU_KEY)) return;
    const job = makeJob({company:'华友钴业',title:'2027 届全球校园招聘（化学化工 / 材料 / 冶金 / 机械 / 电气 / 计算机 / 供应链等）',city:'浙江桐乡、浙江衢州、广西玉林、四川成都、天津；印度尼西亚、津巴布韦、刚果（金）、匈牙利等',salary:'行业竞争力薪资；多地人才补贴；海外补贴更优厚',url:HUAYOU_URL,urls:[HUAYOU_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HUAYOU_TEXT,raw_text:HUAYOU_TEXT,status:'待筛选',notes:'全球校招；岗位覆盖化学化工、材料、冶金、机械、电气、矿业、土木、安环、计算机、供应链、市场、人力、行政、外语等方向；原文未明确具体薪资数额。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HUAYOU_KEY, '1');
    save();
  }
  function addPendingQdzh() {
    if (localStorage.getItem(PENDING_QDZH_KEY)) return;
    const job = makeJob({company:'青岛征和工业股份有限公司',title:'2027 届校园招聘（技术研发 / 职能 / 生产工艺）',city:'山东青岛平度、上海闵行、浙江湖州、泰国、俄罗斯',salary:'本科10-15万/年；硕士13-20万/年；博士40万以上/年（具体面议）',url:'',urls:[],linkParseStatus:'待解析',type:'校招',source:'QQ/微信群',raw:QDZH_TEXT,raw_text:QDZH_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'简历邮箱：qdzhxyzp@163.com；邮件主题：姓名+学校+专业+工作地；要求本科以上、CET-4；原文未提供可复制网申 URL。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_QDZH_KEY, '1');
    save();
  }
  function addPendingScc() {
    if (localStorage.getItem(PENDING_SCC_KEY)) return;
    const job = makeJob({company:'深南电路',title:'2027 届校园招聘（研发技术 / 智能制造 / 市场客户 / 职能 / 博士）',city:'深圳、广州、无锡、南通、成都、上海、泰国',salary:'',url:SCC_URL,urls:[SCC_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SCC_TEXT,raw_text:SCC_TEXT,status:'待筛选',notes:'北京科技大学线下宣讲会：2026-09-15 17:30-18:00，时代凌宇报告厅；2400+需求；福利包括福利宿舍、福利食堂、六险一金、补贴及带薪年假。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SCC_KEY, '1');
    save();
  }
  function addPendingCscec3bInnovation() {
    if (localStorage.getItem(PENDING_CSCEC3B_INNOVATION_KEY)) return;
    const job = makeJob({company:'中建三局科创公司',title:'2027 届校园招聘（智能建造 / 土木工程 / 工程管理 / 安全 / 人力资源）',city:'武汉、北京、上海、深圳、成都、西安',salary:'薪酬面议',url:CSCEC3B_INNOVATION_URL,urls:[CSCEC3B_INNOVATION_URL],linkParseStatus:'需人工打开',type:'校招',source:'QQ/微信群',raw:CSCEC3B_INNOVATION_TEXT,raw_text:CSCEC3B_INNOVATION_TEXT,status:'待筛选',notes:'中国建筑成员企业；招聘简章扫码投递；官网 http://zhaopin.cscec3b.com.cn/ 原文注明“待开放”，请后续人工确认。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CSCEC3B_INNOVATION_KEY, '1');
    save();
  }
  function addPendingFutech() {
    if (localStorage.getItem(PENDING_FUTECH_KEY)) return;
    const job = makeJob({company:'富特科技',title:'2026 届校园招聘（技术研发 / 制造管培 / 职能）',city:'杭州、西安、湖州安吉、法国',salary:'',url:FUTECH_URL,urls:[FUTECH_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:FUTECH_TEXT,raw_text:FUTECH_TEXT,status:'待筛选',tags:['电机/控制'],notes:'2024年上市，股票代码301607；研发中心在杭州、西安，制造中心在湖州安吉，法国设有全资子公司；原文投递链接域名为 app.mokahrcom，按原文保留，未人工验证。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_FUTECH_KEY, '1');
    save();
  }
  function addPendingSept9Fairs() {
    if (localStorage.getItem(PENDING_SEPT9_FAIRS_KEY)) return;
    SEPT9_FAIR_DATA.forEach(item => {
      const eventText = `${item.company}${item.title}\n时间：${item.time}\n地点：${item.place}\n面向学生：${item.audience}\n详细信息：${item.url}`;
      const existing = state.jobs.find(j => normalize(j.company).includes(normalize(item.company)) || normalize(item.company).includes(normalize(j.company)));
      if (item.merge && existing) {
        const urls = getUrls(existing);
        if (!urls.includes(item.url)) {
          urls.push(item.url);
          existing.urls = urls;
          existing.url = urls.join('\n');
        }
        existing.raw = `${existing.raw || existing.raw_text || ''}\n\n--- 补充 2026-09-09 宣讲会 ---\n${eventText}`;
        existing.raw_text = existing.raw;
        existing.notes = `${existing.notes ? existing.notes + '；' : ''}补充宣讲会：${item.time}，${item.place}，面向${item.audience}；详细信息链接已保留。`;
        existing.updatedAt = Date.now();
        return;
      }
      const job = makeJob({company:item.company,title:item.title,city:'北京（宣讲会）',salary:'',url:item.url,urls:[item.url],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:eventText,raw_text:eventText,status:'待筛选',notes:`宣讲时间：${item.time}；地点：${item.place}；面向学生：${item.audience}；该时间为宣讲会时间，不作为岗位截止日期。`});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    });
    localStorage.setItem(PENDING_SEPT9_FAIRS_KEY, '1');
    save();
  }
  function repairSept9FairDuplicates() {
    const targets = [
      {name:'新和成', fullName:'山东新和成控股有限公司', fairUrl:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=db2c25e9a596442caf29af19cab24860&'},
      {name:'中景芯创', fullName:'中景芯创', fairUrl:'https://job.ustb.edu.cn/frontpage/ustb/html/recruitmentFairForm.html?id=6bb200efe79947909f653218c58fb19a&'}
    ];
    let changed = false;
    targets.forEach(target => {
      const matches = state.jobs.filter(j => normalize(j.company).includes(normalize(target.name)) || normalize(target.name).includes(normalize(j.company)));
      if (!matches.length) return;
      const base = matches.find(j => normalize(j.company).includes(normalize(target.fullName))) || matches[0];
      matches.filter(j => j.id !== base.id).forEach(other => {
        const urls = getUrls(base);
        getUrls(other).forEach(url => { if (!urls.includes(url)) urls.push(url); });
        base.urls = urls;
        base.url = urls.join('\n');
        if (other.raw && !String(base.raw || '').includes(other.raw)) base.raw = `${base.raw || base.raw_text || ''}\n\n--- 合并重复记录 ---\n${other.raw}`;
        base.raw_text = base.raw;
        base.notes = `${base.notes ? base.notes + '；' : ''}${other.notes || '已合并重复宣讲会记录'}`;
        state.jobs = state.jobs.filter(j => j.id !== other.id);
        changed = true;
      });
      const urls = getUrls(base);
      if (!urls.includes(target.fairUrl)) {
        urls.push(target.fairUrl);
        base.urls = urls;
        base.url = urls.join('\n');
        changed = true;
      }
    });
    if (changed) save();
  }
  function mergeXinhechengCurrentUpdate() {
    if (localStorage.getItem(PENDING_XINHECHENG_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes(normalize('新和成')));
    if (job) {
      const urls = getUrls(job);
      if (!urls.includes(XINHECHENG_UPDATE_URL)) urls.push(XINHECHENG_UPDATE_URL);
      if (!urls.includes(XINHECHENG_URL)) urls.push(XINHECHENG_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充新和成宣讲会推文 ---\n${XINHECHENG_UPDATE_TEXT}`;
      job.raw_text = job.raw;
      job.city = '浙江新昌、上虞；山东潍坊；黑龙江绥化；天津；海外';
      job.notes = `${job.notes ? job.notes + '；' : ''}已补充新和成宣讲会推文、工作地点、专业要求和网申提示；推文链接已保留。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_XINHECHENG_UPDATE_KEY, '1');
    save();
  }
  function addPendingSuzhouDay() {
    if (localStorage.getItem(PENDING_SUZHOU_DAY_KEY)) return;
    const job = makeJob({company:'校园苏州日（北京大学专场）',title:'全国秋招现场面试活动（100+企事业单位）',city:'北京大学邱德拔体育馆',salary:'',url:SUZHOU_DAY_URL,urls:[SUZHOU_DAY_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SUZHOU_DAY_TEXT,raw_text:SUZHOU_DAY_TEXT,status:'待筛选',notes:'活动时间：2026-09-15 14:30-18:00；实名制入场；QQ群：2161073734；联系电话：18951676577；该记录为招聘活动，不代表单一企业岗位。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SUZHOU_DAY_KEY, '1');
    save();
  }
  function addPendingAac() {
    if (localStorage.getItem(PENDING_AAC_KEY)) return;
    const job = makeJob({company:'瑞声科技',title:'2027 届校园招聘（声学 / 光学 / 马达 / 芯片 / 算法 / 仿真 / 结构 / 电气 / 职能等）',city:'常州、深圳、南京、南宁、上海、苏州、武汉、北京、重庆；越南、马来西亚等',salary:'',url:AAC_URL,urls:[AAC_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:AAC_TEXT,raw_text:AAC_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'校园大使推荐码：AAC27Q045；投递时必须填写“校园大使推荐码”，直接填写普通内推码栏无效；链接参数中的 external_referral_code=MWJAQEU 已原样保留；备用QQ群：1121876496。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_AAC_KEY, '1');
    save();
  }
  function addPendingSinexcel() {
    if (localStorage.getItem(PENDING_SINEXCEL_KEY)) return;
    const job = makeJob({company:'盛弘股份',title:'2027 届校园招聘（电力电子硬件 / DSP软件 / 嵌入式软件 / 结构 / 测试 / EMC / 产品 / 技术营销）',city:'深圳、西安、苏州、惠州；海外派驻/出差',salary:'行业高薪+年终奖+股票期权',url:SINEXCEL_URL,urls:[SINEXCEL_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SINEXCEL_TEXT,raw_text:SINEXCEL_TEXT,status:'待筛选',tags:['电机/控制'],notes:'招聘对象：2027届本硕博应届生；赛道包含储能、AIDC电源、充电桩和新能源电力；福利包括五险一金、双休、住宿/住房补贴、免费班车和导师带教。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SINEXCEL_KEY, '1');
    save();
  }
  function addPendingHkaco() {
    if (localStorage.getItem(PENDING_HKACO_KEY)) return;
    const job = makeJob({company:'虹科电子',title:'2026 届校园招聘（技术研发 / 销售 / 职能 / 市场 / 管培生）',city:'广州',salary:'丰厚薪资；季度奖金；其他待遇以岗位和公司政策为准',url:HKACO_URL,urls:[HKACO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HKACO_TEXT,raw_text:HKACO_TEXT,status:'待筛选',notes:'专属推荐码：ESKMAR；福利包括五险一金、补充商业保险、双休、年度体检、学习补贴等；原文未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HKACO_KEY, '1');
    save();
  }
  function addPendingBlueinteractive() {
    if (localStorage.getItem(PENDING_BLUEINTERACTIVE_KEY)) return;
    const urls = [BLUEINTERACTIVE_URL, BLUEINTERACTIVE_GROUP_URL, BLUEINTERACTIVE_COLLECTION_URL];
    const job = makeJob({company:'深蓝互动',title:'2027 届校园招聘（美术设计 / 技术开发 / 游戏策划 / 市场发行 / 产品支持）',city:'广州',salary:'年底双薪+项目奖金；具体薪资以岗位页面为准',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:BLUEINTERACTIVE_TEXT,raw_text:BLUEINTERACTIVE_TEXT,status:'待筛选',notes:'内推码：DSHVPrQM；招聘对象为2026年9月至2027年8月毕业的27届毕业生；秋招交流群和校招信息集合链接均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BLUEINTERACTIVE_KEY, '1');
    save();
  }
  function addPendingStreamax() {
    if (localStorage.getItem(PENDING_STREAMAX_KEY)) return;
    const job = makeJob({company:'锐明技术',title:'2027 届全球校园招聘（自动驾驶感知 / 视觉算法 / 硬件 / 嵌入式 / 产品 / 营销等）',city:'深圳、重庆、成都、东莞；休斯顿、荷兰、英国、日本、圣保罗等海外',salary:'',url:STREAMAX_URL,urls:[STREAMAX_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:STREAMAX_TEXT,raw_text:STREAMAX_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：EV3PBJ；每位同学最多投递3个岗位，平行志愿；备用QQ群：1121876496；原文未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_STREAMAX_KEY, '1');
    save();
  }
  function addPendingTinci() {
    if (localStorage.getItem(PENDING_TINCI_KEY)) return;
    const job = makeJob({company:'天赐材料',title:'2027 届校园招聘（技术 / 制造 / 职能 / 销售）',city:'广州、上海、九江、龙南、池州、衢州、溧阳、赣州、宜昌、宜春、清远、西宁、德州、眉山、台州、东莞、江门、福鼎、海外',salary:'',url:TINCI_URL,urls:[TINCI_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TINCI_TEXT,raw_text:TINCI_TEXT,status:'待筛选',notes:'股票代码002709；内推码：bgfmdb；福利包括五险一金、项目奖金、食宿配套、年度体检、股票期权等；原文未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TINCI_KEY, '1');
    save();
  }
  function addPendingSfAuto() {
    if (localStorage.getItem(PENDING_SF_AUTO_KEY)) return;
    const job = makeJob({company:'四方继保',title:'2027 届提前批校园招聘（电力自动化 / 智能电网 / 新能源 / 储能）',city:'北京、武汉、南京、湖州、保定、西安、深圳',salary:'行业领先薪酬；八险一金；具体以岗位页面为准',url:SF_AUTO_URL,urls:[SF_AUTO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SF_AUTO_TEXT,raw_text:SF_AUTO_TEXT,status:'待筛选',tags:['电机/控制'],notes:'提前批；推荐码：EVKPJ8；毕业生有机会落户北京；业务覆盖智能电网、智慧配用电、新能源发电及储能。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SF_AUTO_KEY, '1');
    save();
  }
  function addPendingGuangmingTalent() {
    if (localStorage.getItem(PENDING_GUANGMING_TALENT_KEY)) return;
    const job = makeJob({company:'深圳市光明区委组织部、人力资源局',title:'“百博行·奔光明”（秋季）人才见面会（编制选聘 / 企业招聘 / 研学参访）',city:'深圳市光明区',salary:'',url:GUANGMING_TALENT_URL,urls:[GUANGMING_TALENT_URL],linkParseStatus:'需人工打开',type:'其他',source:'QQ/微信群',raw:GUANGMING_TALENT_TEXT,raw_text:GUANGMING_TALENT_TEXT,status:'待筛选',notes:'活动时间：10月11日；上午职员选聘+求职招聘，下午深度研学参访；13个编制岗位，30+优质单位、800+岗位；咨询电话：0755-88212064；报名详情在微信公众号文章中。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_GUANGMING_TALENT_KEY, '1');
    save();
  }
  function addPendingSept10Events() {
    if (localStorage.getItem(PENDING_SEPT10_EVENTS_KEY)) return;
    SEPT10_EVENT_DATA.forEach(item => {
      const eventText = `${item.company}${item.title}\n时间：${item.time}\n地点：${item.place}${item.audience ? `\n面向学生：${item.audience}` : ''}\n详细信息：${item.url}`;
      const matchName = item.matchCompany || item.company;
      const existingJobs = item.merge ? state.jobs.filter(j => normalize(j.company).includes(normalize(matchName)) || normalize(matchName).includes(normalize(j.company))) : [];
      if (existingJobs.length) {
        existingJobs.forEach(existing => {
          const urls = getUrls(existing);
          if (!urls.includes(item.url)) {
            urls.push(item.url);
            existing.urls = urls;
            existing.url = urls.join('\n');
          }
          if (!String(existing.raw || '').includes(item.url)) existing.raw = `${existing.raw || existing.raw_text || ''}\n\n--- 补充 2026-09-10 宣讲会 ---\n${eventText}`;
          existing.raw_text = existing.raw;
          existing.notes = `${existing.notes ? existing.notes + '；' : ''}补充宣讲会：${item.time}，${item.place}${item.audience ? `，面向${item.audience}` : ''}；详细信息链接已保留。`;
          existing.updatedAt = Date.now();
        });
        return;
      }
      const job = makeJob({company:item.company,title:item.title,city:'北京（宣讲会/双选会）',salary:'',url:item.url,urls:[item.url],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:eventText,raw_text:eventText,status:'待筛选',notes:`宣讲/双选会时间：${item.time}；地点：${item.place}${item.audience ? `；面向学生：${item.audience}` : ''}；该时间为活动时间，不作为岗位截止日期。`});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    });
    localStorage.setItem(PENDING_SEPT10_EVENTS_KEY, '1');
    save();
  }
  function addPendingHongwang() {
    if (localStorage.getItem(PENDING_HONGWANG_KEY)) return;
    const job = makeJob({company:'宏旺',title:'待确认（微信文章）',city:'',salary:'',url:HONGWANG_URL,urls:[HONGWANG_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:HONGWANG_TEXT,raw_text:HONGWANG_TEXT,status:'待筛选',notes:'目前仅收到公司名称和微信公众号文章链接，岗位、地点、招聘类型及具体投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HONGWANG_KEY, '1');
    save();
  }
  function addPendingSmartlogic() {
    if (localStorage.getItem(PENDING_SMARTLOGIC_KEY)) return;
    const job = makeJob({company:'上海思朗科技股份有限公司',title:'2027 届校园招聘（芯片 / 软件生态 / 科学计算 / 5G小基站等）',city:'上海、北京、西安、成都、杭州、深圳',salary:'具备竞争力的薪酬待遇',url:SMARTLOGIC_URL,urls:[SMARTLOGIC_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SMARTLOGIC_TEXT,raw_text:SMARTLOGIC_TEXT,status:'待筛选',notes:'拥有自主知识产权MaPU架构；多地40+岗位；宣讲现场接收纸质简历并发放面试直通卡；原文未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SMARTLOGIC_KEY, '1');
    save();
  }
  function addPendingUniversityRecruitment() {
    if (localStorage.getItem(PENDING_UNIVERSITY_RECRUITMENT_KEY)) return;
    UNIVERSITY_RECRUITMENT_DATA.forEach(item => {
      const job = makeJob({company:item.company,title:item.title,city:'',salary:'',url:item.url,urls:[item.url],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:item.raw,raw_text:item.raw,status:'待筛选',notes:'高校教职/人才招聘公告；岗位、地点、学历及具体投递要求请人工打开微信公众号文章确认。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    });
    localStorage.setItem(PENDING_UNIVERSITY_RECRUITMENT_KEY, '1');
    save();
  }
  function addPendingTorras() {
    if (localStorage.getItem(PENDING_TORRAS_KEY)) return;
    const urls = [TORRAS_URL, TORRAS_GROUP_URL];
    const job = makeJob({company:'图拉斯',title:'2027 届校园招聘（电商运营 / 设计 / 产品 / 传媒 / 营销 / 技术工程 / 职能）',city:'深圳市龙华区',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TORRAS_TEXT,raw_text:TORRAS_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'内推码：DZJFXUJ；含电商AI训练师岗位；国内/海外电商运营岗位不限专业；内推社群链接和投递链接均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TORRAS_KEY, '1');
    save();
  }
  function addPendingTauren() {
    if (localStorage.getItem(PENDING_TAUREN_KEY)) return;
    const urls = [TAUREN_URL, TAUREN_GROUP_URL];
    const job = makeJob({company:'韬润半导体 TAUREN',title:'2027 届校园招聘（数字前端 / 算法架构 / 模拟电路 / 硅光 / 技术销售 / 投融资管培）',city:'上海',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TAUREN_TEXT,raw_text:TAUREN_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2027届海内外应届毕业生；投递链接和27秋招交流群均已保留；原文未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TAUREN_KEY, '1');
    save();
  }
  function addPendingPinganLife() {
    if (localStorage.getItem(PENDING_PINGAN_LIFE_KEY)) return;
    const urls = [PINGAN_LIFE_URL, PINGAN_GROUP_URL];
    const job = makeJob({company:'平安人寿',title:'2027 届校园招聘（产品运营 / 市场策划 / 风控 / 技术支持 / 产品 / 算法 / 人力资源）',city:'全国多地（阿克苏、阿勒泰、安阳、巴中、白城、白山、白银等）',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:PINGAN_LIFE_TEXT,raw_text:PINGAN_LIFE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2027届应届毕业生；投递链接及27秋招交流群均已保留；原文未明确具体薪资和完整城市列表。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_PINGAN_LIFE_KEY, '1');
    save();
  }
  function addPendingNovosns() {
    if (localStorage.getItem(PENDING_NOVOSNS_KEY)) return;
    const job = makeJob({company:'纳芯微',title:'2027 届校园招聘（芯片设计研发 / 产品系统应用 / 技术客户 / 制造质量供应链 / 职能组织支持）',city:'北京（宣讲会）；海内外多地岗位',salary:'',url:NOVOSNS_URL,urls:[NOVOSNS_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:NOVOSNS_TEXT,raw_text:NOVOSNS_TEXT,status:'待筛选',notes:'北京专场宣讲会：9月15日18:00，北京中关村皇冠假日酒店3F皇冠宴会厅B；宣讲后直接进入面试，提前网申优先安排；毕业两年内符合要求者也可投递。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_NOVOSNS_KEY, '1');
    save();
  }
  function addPendingSmic() {
    if (localStorage.getItem(PENDING_SMIC_KEY)) return;
    const job = makeJob({company:'中芯国际',title:'2027 届校园招聘（技术研发 / 电路设计 / 工艺工程 / 设备管理 / 智能制造 / 软件算法等）',city:'上海张江、上海临港、北京、天津、深圳',salary:'',url:SMIC_URL,urls:[SMIC_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SMIC_TEXT,raw_text:SMIC_TEXT,status:'待筛选',notes:'招聘专业覆盖电子信息、集成电路、材料、物理、化学、光学、机械、自动化与控制、计算机、智能制造、数学、环境与安全及管理等；公众号：中芯国际微招聘；原文未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SMIC_KEY, '1');
    save();
  }
  function addPendingUisee() {
    if (localStorage.getItem(PENDING_UISEE_KEY)) return;
    const job = makeJob({company:'驭势科技',title:'2027 届校园招聘（通信技术 / 智能网联 / 嵌入式 / SLAM / 规控算法 / C++等）',city:'北京、重庆、嘉兴、上海、深圳、乌鲁木齐、香港、新加坡',salary:'',url:UISEE_URL,urls:[UISEE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:UISEE_TEXT,raw_text:UISEE_TEXT,status:'待筛选',tags:['AI/Agent','电机/控制'],notes:'L4自动驾驶方向；招聘对象：2027届应届毕业生；投递链接已保留；原文未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_UISEE_KEY, '1');
    save();
  }
  function mergeQunarUpdate() {
    if (localStorage.getItem(PENDING_QUNAR_UPDATE_KEY)) return;
    const jobs = state.jobs.filter(j => normalize(j.company).includes(normalize('去哪儿')));
    if (jobs.length) {
      jobs.forEach(job => {
        const urls = getUrls(job);
        if (!urls.includes(QUNAR_UPDATE_URL)) urls.push(QUNAR_UPDATE_URL);
        if (!urls.includes(QUNAR_URL)) urls.push(QUNAR_URL);
        job.urls = urls;
        job.url = urls.join('\n');
        job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充去哪儿招聘消息 ---\n${QUNAR_UPDATE_TEXT}`;
        job.raw_text = job.raw;
        job.notes = `${job.notes ? job.notes + '；' : ''}已补充混合办公、福利和本次消息原始投递链接；原链接域名疑似缺少分隔符，按原文保留。`;
        job.updatedAt = Date.now();
      });
    }
    localStorage.setItem(PENDING_QUNAR_UPDATE_KEY, '1');
    save();
  }
  function addPendingHuolala() {
    if (localStorage.getItem(PENDING_HUOLALA_KEY)) return;
    const urls = [HUOLALA_URL, HUOLALA_GROUP_URL];
    const job = makeJob({company:'货拉拉',title:'2027 届校园招聘（管理储备 / 算法 / 软件 / 大数据 / 云平台 / 产品运营 / 职能）',city:'深圳、北京、上海、广州、长沙、重庆、杭州等；中国香港、东南亚、欧美等海外',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HUOLALA_TEXT,raw_text:HUOLALA_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'内推码：DSmQKzkT；业务融合AI和大数据；内推投递链接及秋招交流群链接均已保留；原文未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HUOLALA_KEY, '1');
    save();
  }
  function addPendingChangshaMining() {
    if (localStorage.getItem(PENDING_CHANGSHA_MINING_KEY)) return;
    const job = makeJob({company:'长沙矿冶院',title:'待确认（微信文章）',city:'',salary:'',url:CHANGSHA_MINING_URL,urls:[CHANGSHA_MINING_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CHANGSHA_MINING_TEXT,raw_text:CHANGSHA_MINING_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，具体岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CHANGSHA_MINING_KEY, '1');
    save();
  }
  function addPendingSankeTree() {
    if (localStorage.getItem(PENDING_SANKE_TREE_KEY)) return;
    const job = makeJob({company:'三棵树',title:'2027 届校园招聘（技术应用 / 营销业务 / 供应链 / 技术研发 / 财务 / 信息 / 职能 / 博士）',city:'北京、上海、成都、滁州、贺州、莆田、孝感',salary:'',url:SANKE_TREE_URL,urls:[SANKE_TREE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SANKE_TREE_TEXT,raw_text:SANKE_TREE_TEXT,status:'待筛选',notes:'内推码：gczodo；也可关注三棵树公众号，选择“应届生招聘”后投递；薪资未在原消息中明确。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SANKE_TREE_KEY, '1');
    save();
  }
  function addPendingLiyang() {
    if (localStorage.getItem(PENDING_LIYANG_KEY)) return;
    const job = makeJob({company:'中国航发黎阳',title:'2026-2027 届校园招聘宣讲（航空发动机 / 机械 / 计算机 / 职能等）',city:'贵州贵阳',salary:'',url:LIYANG_URL,urls:[LIYANG_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:LIYANG_TEXT,raw_text:LIYANG_TEXT,status:'待筛选',notes:'宣讲时间：2026-09-12 13:30；地点：时代凌宇报告厅；单位网申链接已保留；原消息未明确具体薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_LIYANG_KEY, '1');
    save();
  }
  function mergeLiyangFair() {
    if (localStorage.getItem(PENDING_LIYANG_FAIR_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('中国航发黎阳') || getUrls(j).some(url => url.includes('campus.51job.com/liyang')));
    if (job) {
      const urls = getUrls(job);
      if (!urls.includes(LIYANG_FAIR_URL)) urls.push(LIYANG_FAIR_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.title = '2027 届秋季校园招聘（航空发动机 / 机械 / 计算机 / 职能等）';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 宣讲会补充信息 ---\n${LIYANG_FAIR_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充宣讲会：2026-09-12 13:30-15:00，时代凌宇报告厅，面向本科/硕士/博士；宣讲详情链接已保留。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_LIYANG_FAIR_KEY, '1');
    save();
  }
  function addPendingIoptFair() {
    if (localStorage.getItem(PENDING_IOPT_FAIR_KEY)) return;
    const job = makeJob({company:'中国科学院光电技术研究所',title:'2027 年秋季校园招聘宣讲会',city:'北京（宣讲会）',salary:'',url:IOPT_FAIR_URL,urls:[IOPT_FAIR_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:IOPT_FAIR_TEXT,raw_text:IOPT_FAIR_TEXT,status:'待筛选',notes:'宣讲时间：2026-09-12 15:30-17:00；地点：时代凌宇报告厅；面向硕士、博士；具体岗位和工作地点请以宣讲详情为准。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_IOPT_FAIR_KEY, '1');
    save();
  }
  function addPendingSuzhouFair() {
    if (localStorage.getItem(PENDING_SUZHOU_FAIR_KEY)) return;
    const job = makeJob({company:'苏州',title:'双选会（待确认）',city:'苏州',salary:'',url:SUZHOU_FAIR_URL,urls:[SUZHOU_FAIR_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SUZHOU_FAIR_TEXT,raw_text:SUZHOU_FAIR_TEXT,status:'待筛选',notes:'目前仅收到“苏州”和双选会详情链接；具体活动名称、时间、地点、参会单位和岗位请打开详情后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SUZHOU_FAIR_KEY, '1');
    save();
  }
  function addPendingSept14Fairs() {
    if (localStorage.getItem(PENDING_SEPT14_FAIRS_KEY)) return;
    SEPT14_FAIR_ITEMS.forEach(item => {
      const findExisting = () => {
        if (item.merge === 'suzhou') return state.jobs.find(j => normalize(j.company) === '苏州' || getUrls(j).some(url => url.includes('da671b9ef39941e7be3dc1a1b61309ca')));
        if (item.merge === 'huali') return state.jobs.find(j => normalize(j.company).includes('上海华力') || getUrls(j).some(url => url.includes('qo2b8jACKpxUPkDhq2KDOQ')));
        return null;
      };
      const existing = findExisting();
      const fairText = `${item.company}${item.title ? `｜${item.title}` : ''}\n举办时间：${item.time}\n举办地点：${item.venue}${item.levels ? `\n面向学生层次：${item.levels}` : ''}\n详细信息：${item.url}`;
      if (existing) {
        const urls = getUrls(existing);
        if (!urls.includes(item.url)) urls.push(item.url);
        existing.urls = urls;
        existing.url = urls.join('\n');
        existing.company = item.company;
        existing.title = item.title;
        existing.city = item.city;
        existing.type = '校招';
        existing.raw = `${existing.raw || existing.raw_text || ''}\n\n--- 9.14 活动补充信息 ---\n${fairText}`;
        existing.raw_text = existing.raw;
        existing.notes = `${existing.notes ? existing.notes + '；' : ''}活动时间：${item.time}；地点：${item.venue}${item.levels ? `；面向${item.levels}` : ''}；详情链接已保留。`;
        existing.updatedAt = Date.now();
      } else {
        const job = makeJob({company:item.company,title:item.title,city:item.city,salary:'',url:item.url,urls:[item.url],linkParseStatus:'已解析',type:'校招',source:'校园招聘会',raw:fairText,raw_text:fairText,status:'待筛选',notes:`活动时间：${item.time}；地点：${item.venue}${item.levels ? `；面向${item.levels}` : ''}；具体岗位和工作地点请以详情链接为准。`});
        if (!isDuplicate(job)) state.jobs.unshift(job);
      }
    });
    localStorage.setItem(PENDING_SEPT14_FAIRS_KEY, '1');
    save();
  }
  function mergeMammotionUpdate() {
    if (localStorage.getItem(PENDING_MAMMOTION_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('库犸') || getUrls(j).some(url => url.includes('4c113952491a4262bcaf2d549605331b')));
    if (job) {
      const urls = getUrls(job);
      if (!urls.includes(MAMMOTION_URL)) urls.push(MAMMOTION_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '库犸科技（Mammotion）';
      job.title = '2027 届全球校园招聘（硬件 / 结构 / 嵌入式 / 算法 / 具身智能等）';
      job.city = '北京（9月14日宣讲会）';
      job.type = '校招';
      job.tags = Array.from(new Set([...(job.tags || []), 'AI/Agent']));
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 招聘消息补充 ---\n${MAMMOTION_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充正式投递链接、具身智能/算法岗位和福利信息；招聘对象为2026年9月-2027年12月毕业的本科及以上应届生。`;
      job.updatedAt = Date.now();
    } else {
      const job = makeJob({company:'库犸科技（Mammotion）',title:'2027 届全球校园招聘（硬件 / 结构 / 嵌入式 / 算法 / 具身智能等）',city:'北京（9月14日宣讲会）',salary:'',url:MAMMOTION_URL,urls:[MAMMOTION_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:MAMMOTION_TEXT,raw_text:MAMMOTION_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'宣讲会时间：2026年9月14日17:30；投递链接已保留；招聘对象为2026年9月-2027年12月毕业的本科及以上应届生。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    }
    localStorage.setItem(PENDING_MAMMOTION_UPDATE_KEY, '1');
    save();
  }
  function addPendingLenovo() {
    if (localStorage.getItem(PENDING_LENOVO_KEY)) return;
    const urls = [LENOVO_URL, LENOVO_QA_URL];
    const job = makeJob({company:'联想集团',title:'2027 届秋季校园招聘（产品与项目 / 技术 / 市场销售 / 职能 / 供应链 / 设计）',city:'北京、上海、深圳、天津、武汉、成都、广州、杭州、南京、厦门、长沙、郑州、济南、沈阳、哈尔滨、昆山、南宁等',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:LENOVO_TEXT,raw_text:LENOVO_TEXT,status:'待筛选',notes:'内推码/推荐人itCode：2027XZLMXX；已有联想校招官网简历的需要重新创建简历，选择“联想员工推荐”并填写推荐人itCode；官网和答疑文档链接均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_LENOVO_KEY, '1');
    save();
  }
  function addPendingXiaohongshu() {
    if (localStorage.getItem(PENDING_XIAOHONGSHU_KEY)) return;
    const job = makeJob({company:'小红书',title:'校园正式岗位招聘（后端 / 前端 / 客户端 / AI / 大数据 / 产品 / 运营等）',city:'',salary:'',url:XIAOHONGSHU_URL,urls:[XIAOHONGSHU_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:XIAOHONGSHU_TEXT,raw_text:XIAOHONGSHU_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象为全球本科、硕士、博士应届毕业生，专业不限；岗位覆盖技术、产品和非技术方向；原消息未明确具体工作地点和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_XIAOHONGSHU_KEY, '1');
    save();
  }
  function addPendingEcoflow() {
    if (localStorage.getItem(PENDING_ECOFLOW_KEY)) return;
    const job = makeJob({company:'正浩创新 EcoFlow',title:'2027 届校园招聘（研发 / 产品 / 营销服 / 供应链 / 采购 / 职能 / 设计）',city:'深圳、苏州、西安',salary:'部分岗位最高可达50w；特别优秀同学可配股',url:ECOFLOW_URL,urls:[ECOFLOW_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ECOFLOW_TEXT,raw_text:ECOFLOW_TEXT,status:'待筛选',notes:'内推码：6DHKG7V；内推投递简历优先筛选，面试流程加快。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ECOFLOW_KEY, '1');
    save();
  }
  function mergeTuhuUpdate() {
    if (localStorage.getItem(PENDING_TUHU_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('途虎') || getUrls(j).some(url => url.includes('tuhu/28398')));
    if (job) {
      const urls = getUrls(job);
      if (!urls.includes(TUHU_UPDATED_URL)) urls.push(TUHU_UPDATED_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '途虎养车';
      job.title = '2027 届校园招聘（工程 / 算法 / 产品 / 运营 / 供应链）';
      job.city = '上海、武汉';
      job.type = '校招';
      job.tags = Array.from(new Set([...(job.tags || []), 'AI/Agent']));
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 后续招聘消息 ---\n${TUHU_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充最新校招HR内推码：DSjwV8zP；岗位分为工程、算法、产品、运营、供应链五类；原始链接全部保留。`;
      job.updatedAt = Date.now();
    } else {
      const job = makeJob({company:'途虎养车',title:'2027 届校园招聘（工程 / 算法 / 产品 / 运营 / 供应链）',city:'上海、武汉',salary:'',url:TUHU_UPDATED_URL,urls:[TUHU_UPDATED_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TUHU_UPDATED_TEXT,raw_text:TUHU_UPDATED_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'校招HR内推码：DSjwV8zP；算法岗位包含感知、定位、避障等方向。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    }
    localStorage.setItem(PENDING_TUHU_UPDATE_KEY, '1');
    save();
  }
  function addPendingCscecInternational() {
    if (localStorage.getItem(PENDING_CSCEC_INTERNATIONAL_KEY)) return;
    const job = makeJob({company:'中建国际',title:'2027 届校园招聘（工程建设 / 交通 / 安全 / 材料 / 机电 / 职能 / 语言等）',city:'北京、苏州双总部；长三角地区及海外',salary:'行业第一梯队薪酬待遇；六险二金及多项津贴',url:CSCEC_INTERNATIONAL_URL,urls:[CSCEC_INTERNATIONAL_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CSCEC_INTERNATIONAL_TEXT,raw_text:CSCEC_INTERNATIONAL_TEXT,status:'待筛选',notes:'投递邮箱：zhang_hongpo@chinaconstruction.com；原文提示有校招微信群二维码，但未提供可复制链接；具体岗位详见招聘简章。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CSCEC_INTERNATIONAL_KEY, '1');
    save();
  }
  function addPendingSugon() {
    if (localStorage.getItem(PENDING_SUGON_KEY)) return;
    const job = makeJob({company:'中科曙光',title:'2027 校园招聘宣讲会（超算 / 高端计算 / 存储 / 网络 / 云计算等）',city:'北京海淀区',salary:'',url:'',urls:[],linkParseStatus:'待解析',type:'校招',source:'图片/海报',raw:SUGON_TEXT,raw_text:SUGON_TEXT,status:'待筛选',notes:'宣讲时间：9月16日19:00；地点：北京科技大学海淀校区逸夫楼706；海报二维码用于扫码投递简历，当前没有可复制的投递链接，请扫码后手动补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SUGON_KEY, '1');
    save();
  }
  function addPendingKehuaData() {
    if (localStorage.getItem(PENDING_KEHUA_DATA_KEY)) return;
    const urls = [KEHUA_DATA_FAIR_URL, KEHUA_DATA_URL];
    const job = makeJob({company:'科华数据股份有限公司',title:'2027 届校园招聘（电力电子 / 电气 / 自动化 / 控制 / 新能源 / 储能等）',city:'北京（宣讲会）',salary:'本科15-25W；硕士25-40+W；博士一人一议',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:KEHUA_DATA_TEXT,raw_text:KEHUA_DATA_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'宣讲时间：2026-09-15 15:30；地点：招生就业多功能厅；现场收简历+现场面试；宣讲详情和企业网申链接均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_KEHUA_DATA_KEY, '1');
    save();
  }
  function addPendingGree() {
    if (localStorage.getItem(PENDING_GREE_KEY)) return;
    const job = makeJob({company:'格力电器',title:'2027 届校园招聘（技术研发 / 信息技术 / 技术支持 / 制造技术 / 经营销售 / 行政职能 / 采购物流）',city:'',salary:'',url:GREE_URL,urls:[GREE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:GREE_TEXT,raw_text:GREE_TEXT,status:'待筛选',tags:['电机/控制'],notes:'原文标题为“27届秋招”，正文首段出现“2026届校招”字样，年份存在差异，已按原文保留；投递也可通过“格力电器招聘”微信公众号进入校园招聘。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_GREE_KEY, '1');
    save();
  }
  function mergeGreeUpdate() {
    if (localStorage.getItem(PENDING_GREE_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('格力电器') || getUrls(j).some(url => url.includes('greeyun.com')));
    if (job) {
      const urls = getUrls(job);
      if (!urls.includes(GREE_QA_URL)) urls.push(GREE_QA_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '格力电器';
      job.title = '2027 届校园招聘（技术研发 / 信息技术 / 技术支持 / 制造技术 / 经营销售 / 行政职能 / 采购物流）';
      job.type = '校招';
      job.tags = Array.from(new Set([...(job.tags || []), '电机/控制']));
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 招聘海报补充信息 ---\n${GREE_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充官方推荐码 BGREE54231、岗位答疑链接和海报招聘对象信息；网申链接及答疑链接已保留。`;
      job.updatedAt = Date.now();
    } else {
      const urls = [GREE_URL, GREE_QA_URL];
      const job = makeJob({company:'格力电器',title:'2027 届校园招聘（技术研发 / 信息技术 / 技术支持 / 制造技术 / 经营销售 / 行政职能 / 采购物流）',city:'',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'图片/海报',raw:GREE_UPDATED_TEXT,raw_text:GREE_UPDATED_TEXT,status:'待筛选',tags:['电机/控制'],notes:'官方推荐码：BGREE54231；具体岗位和地点以官方招聘页面为准。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    }
    localStorage.setItem(PENDING_GREE_UPDATE_KEY, '1');
    save();
  }
  function addPendingCnki() {
    if (localStorage.getItem(PENDING_CNKI_KEY)) return;
    const urls = [CNKI_FAIR_URL, CNKI_URL];
    const job = makeJob({company:'同方知网数字科技有限公司（中国知网）',title:'2027 届校园招聘宣讲（计算机 / AI / 软件 / 信息安全 / 智能制造 / 大数据）',city:'北京（宣讲会）',salary:'',url:urls.join('\n'),urls,linkParseStatus:'需人工打开',type:'校招',source:'QQ/微信群',raw:CNKI_TEXT,raw_text:CNKI_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'所属中核集团/同方股份；宣讲时间：2026-09-15 15:30；地点：逸夫楼302；微信宣讲链接和企业网申链接均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CNKI_KEY, '1');
    save();
  }
  function mergeSfAutoUpdate() {
    if (localStorage.getItem(PENDING_SF_AUTO_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('四方继保') || normalize(j.company).includes('四方股份') || getUrls(j).some(url => url.includes('sf-auto1.zhiye.com')));
    if (job) {
      const urls = getUrls(job);
      if (!urls.includes(SF_AUTO_URL)) urls.push(SF_AUTO_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '四方继保（四方股份）';
      job.title = '2027 届校园招聘（继电保护 / 电力系统 / 电力电子 / 智能体 / 算法 / 软件等）';
      job.city = '北京、武汉、南京、湖州、保定、西安、深圳';
      job.salary = '研发类硕士28W起；博士50W起；八险一金';
      job.type = '校招';
      job.tags = Array.from(new Set([...(job.tags || []), 'AI/Agent', '电机/控制']));
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 宣讲会补充信息 ---\n${SF_AUTO_UPDATE_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充宣讲会：9月16日14:00，逸夫楼707；研发硕士28W起、博士50W起；手机端投递方式和七地工作地点已补充。`;
      job.updatedAt = Date.now();
    } else {
      const job = makeJob({company:'四方继保（四方股份）',title:'2027 届校园招聘（继电保护 / 电力系统 / 电力电子 / 智能体 / 算法 / 软件等）',city:'北京、武汉、南京、湖州、保定、西安、深圳',salary:'研发类硕士28W起；博士50W起；八险一金',url:SF_AUTO_URL,urls:[SF_AUTO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SF_AUTO_UPDATE_TEXT,raw_text:SF_AUTO_UPDATE_TEXT,status:'待筛选',tags:['AI/Agent','电机/控制'],notes:'宣讲时间：9月16日14:00；地点：逸夫楼707；PC端投递链接已保留。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    }
    localStorage.setItem(PENDING_SF_AUTO_UPDATE_KEY, '1');
    save();
  }
  function mergeJiachenUpdate() {
    if (localStorage.getItem(PENDING_JIACHEN_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes(normalize('武汉嘉晨电子技术股份有限公司')));
    if (job) {
      const urls = getUrls(job);
      if (!urls.includes(JIACHEN_UPDATE_URL)) {
        urls.push(JIACHEN_UPDATE_URL);
        job.urls = urls;
        job.url = urls.join('\n');
      }
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充微信公众号招聘信息 ---\n${JIACHEN_UPDATE_TEXT}`;
      job.raw_text = job.raw;
      job.city = job.city || '武汉（总部）；上海、日本名古屋、德国慕尼黑、美国加州等研发分支；宁德、宜宾、广州、厦门等生产基地';
      job.notes = `${job.notes ? job.notes + '；' : ''}已补充微信公众号文章、企业简介、需求专业和福利信息；宣讲时间：9月9日15:30-17:00，地点：机电信息楼616。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_JIACHEN_UPDATE_KEY, '1');
    save();
  }
  function addPendingShanghaiHuali() {
    if (localStorage.getItem(PENDING_SHANGHAI_HUALI_KEY)) return;
    const job = makeJob({company:'上海华力',title:'待确认（微信文章）',city:'',salary:'',url:SHANGHAI_HUALI_URL,urls:[SHANGHAI_HUALI_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:SHANGHAI_HUALI_TEXT,raw_text:SHANGHAI_HUALI_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及具体投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SHANGHAI_HUALI_KEY, '1');
    save();
  }
  function addPendingNewOriental() {
    if (localStorage.getItem(PENDING_NEW_ORIENTAL_KEY)) return;
    const job = makeJob({company:'新东方',title:'2027 届提前批校园招聘（教师 / 运营 / 管培 / 实习生）',city:'全国70+城市（按个人意愿就近安排）',salary:'一岗一议；另有绩效奖、教师续班奖等',url:NEW_ORIENTAL_URL,urls:[NEW_ORIENTAL_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:NEW_ORIENTAL_TEXT,raw_text:NEW_ORIENTAL_TEXT,status:'待筛选',notes:'提前批校招；专业不限；欢迎本硕博投递；福利包含五险一金、六节福利、体检、探亲假、带薪年假及培训项目。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_NEW_ORIENTAL_KEY, '1');
    save();
  }
  function addPendingTavern() {
    if (localStorage.getItem(PENDING_TAVERN_KEY)) return;
    const job = makeJob({company:'麦吉太文 Magic Tavern',title:'2027 届秋季校园招聘（策划 / 市场 / 程序 / 数据分析 / 美术）',city:'北京',salary:'',url:TAVERN_URL,urls:[TAVERN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TAVERN_TEXT,raw_text:TAVERN_TEXT,status:'待筛选',notes:'专属推荐码：DSjv4BgA；招聘对象：2027 届海内外高校应届毕业生。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TAVERN_KEY, '1');
    save();
  }
  function addPendingLuster() {
    if (localStorage.getItem(PENDING_LUSTER_KEY)) return;
    const job = makeJob({company:'凌云光',title:'2027 届校园招聘（研究 / 算法 / 软件 / 光学 / 自动化 / 硬件 / 测试 / 供应链等）',city:'苏州、北京、上海、深圳、西安、合肥、武汉、成都、越南、马来西亚、新加坡',salary:'',url:LUSTER_URL,urls:[LUSTER_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:LUSTER_TEXT,raw_text:LUSTER_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'热招岗位包含研究类（算法&光学博士）、算法类、软件类、光学类、自动化类、硬件、测试类、供应链类、营销项目类、技术支持类、海外管培生。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_LUSTER_KEY, '1');
    save();
  }
  function addPendingCctc() {
    if (localStorage.getItem(PENDING_CCTC_KEY)) return;
    const urls = [CCTC_PC_URL, CCTC_WECHAT_URL];
    const job = makeJob({company:'三环集团',title:'2027 届秋季校园招聘（研发 / 机电 / 技术支持 / 职能）',city:'潮州、深圳、成都、德阳、南充、苏州、泰国春武里',salary:'',url:urls.join('\n'),urls,linkParseStatus:'需人工打开',type:'校招',source:'QQ/微信群',raw:CCTC_TEXT,raw_text:CCTC_TEXT,status:'待筛选',notes:'PC端：hr.cctc.cc；手机端：关注 CCTC 三环招聘公众号；福利包含员工公寓、员工餐厅、五险一金、带薪年假、集体婚礼。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CCTC_KEY, '1');
    save();
  }
  function addPendingHellotech() {
    if (localStorage.getItem(PENDING_HELLOTECH_KEY)) return;
    const job = makeJob({company:'华宝新能',title:'2027 全球校园招聘（研发管培生 / 营销管培生 / 供应链管培生）',city:'深圳；硅谷、东京、杜塞尔多夫、墨尔本',salary:'行业内部具竞争力的起薪；3年快节奏晋升调薪机制；多层次评级激励及专项奖金',url:HELLOTECH_URL,urls:[HELLOTECH_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HELLOTECH_TEXT,raw_text:HELLOTECH_TEXT,status:'待筛选',notes:'学校专属推荐码：EVBMRS（填写推荐码投递，简历优先筛选）；总部深圳，布局硅谷、东京、杜塞尔多夫、墨尔本。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HELLOTECH_KEY, '1');
    save();
  }
  function mergeHellotechUpdate() {
    if (localStorage.getItem(PENDING_HELLOTECH_UPDATE_KEY)) return;
    let job = state.jobs.find(j => normalize(j.company).includes('华宝新能') || getUrls(j).some(url => url.includes('hello-tech.com/campus/jobs')));
    if (!job) {
      const urls = [HELLOTECH_UPDATED_URL, HELLOTECH_GROUP_URL, HELLOTECH_COLLECTION_URL];
      job = makeJob({company:'华宝新能',title:'2027 全球校园招聘（研发管培生 / 营销管培生 / 供应链管培生）',city:'深圳、加利福尼亚、东京、首尔、杜塞尔多夫',salary:'高起薪；快节奏调薪；住房补贴/人才房；宵夜补贴；落户等',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HELLOTECH_UPDATED_TEXT,raw_text:HELLOTECH_UPDATED_TEXT,status:'待筛选',notes:'内推码：ES3MTR；另保留此前消息中的推荐码 EVBMRS；研发、营销、供应链管培生均包含轮岗方向。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    } else {
      const urls = getUrls(job);
      [HELLOTECH_UPDATED_URL, HELLOTECH_GROUP_URL, HELLOTECH_COLLECTION_URL].forEach(url => { if (!urls.includes(url)) urls.push(url); });
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '华宝新能';
      job.title = '2027 全球校园招聘（研发管培生 / 营销管培生 / 供应链管培生）';
      job.city = '深圳、加利福尼亚、东京、首尔、杜塞尔多夫';
      job.salary = '高起薪；快节奏调薪；住房补贴/人才房；宵夜补贴；落户等';
      job.type = '校招';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充招聘消息 ---\n${HELLOTECH_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充内推码 ES3MTR、深圳/加利福尼亚/东京/首尔/杜塞尔多夫工作地点、管培生轮岗方向、秋招交流群及校招信息集合链接；原始链接全部保留。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_HELLOTECH_UPDATE_KEY, '1');
    save();
  }
  function mergeHellotechRecommendUpdate() {
    if (localStorage.getItem(PENDING_HELLOTECH_RECOMMEND_UPDATE_KEY)) return;
    let job = state.jobs.find(j => normalize(j.company).includes('华宝新能') || getUrls(j).some(url => url.includes('hello-tech.com/campus/jobs')));
    if (!job) {
      job = makeJob({company:'华宝新能',title:'2027 全球校园招聘（研发管培生 / 营销管培生 / 供应链管培生）',city:'深圳、硅谷、东京、杜塞尔多夫、墨尔本',salary:'行业内部具竞争力的起薪；3年快节奏晋升调薪机制；多层次评级激励及专项奖金',url:HELLOTECH_URL,urls:[HELLOTECH_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HELLOTECH_RECOMMEND_UPDATE_TEXT,raw_text:HELLOTECH_RECOMMEND_UPDATE_TEXT,status:'待筛选',notes:'最新学校专属推荐码：ESKPKJ。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    } else {
      const urls = getUrls(job);
      if (!urls.includes(HELLOTECH_URL)) urls.push(HELLOTECH_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 最新推荐码补充 ---\n${HELLOTECH_RECOMMEND_UPDATE_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}最新学校专属推荐码已更新为 ESKPKJ；原有招聘信息和链接保留。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_HELLOTECH_RECOMMEND_UPDATE_KEY, '1');
    save();
  }
  function addPendingCfMoto() {
    if (localStorage.getItem(PENDING_CF_MOTO_KEY)) return;
    const job = makeJob({company:'春风动力',title:'待确认（微信文章）',city:'',salary:'',url:CF_MOTO_URL,urls:[CF_MOTO_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CF_MOTO_TEXT,raw_text:CF_MOTO_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，具体岗位、地点和招聘类型请人工打开文章确认。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CF_MOTO_KEY, '1');
    save();
  }
  function addPendingLeapmotor() {
    if (localStorage.getItem(PENDING_LEAPMOTOR_KEY)) return;
    const job = makeJob({company:'零跑汽车',title:'待确认（微信文章）',city:'',salary:'',url:LEAPMOTOR_URL,urls:[LEAPMOTOR_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:LEAPMOTOR_TEXT,raw_text:LEAPMOTOR_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，具体岗位、地点和招聘类型请人工打开文章确认。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_LEAPMOTOR_KEY, '1');
    save();
  }
  function addPendingVisionox() {
    if (localStorage.getItem(PENDING_VISIONOX_KEY)) return;
    const job = makeJob({company:'维信诺',title:'待确认（微信文章）',city:'',salary:'',url:VISIONOX_URL,urls:[VISIONOX_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:VISIONOX_TEXT,raw_text:VISIONOX_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，具体岗位、地点和招聘类型请人工打开文章确认。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_VISIONOX_KEY, '1');
    save();
  }
  function addPendingAnker() {
    if (localStorage.getItem(PENDING_ANKER_KEY)) return;
    const job = makeJob({company:'安克创新',title:'2027 届全球校园招聘（研发技术 / 产品与体验 / 设计 / 市场 / 供应链 / 品质 / 职能 / 制造）',city:'深圳、长沙、北京等7城；美国、加拿大、澳大利亚等10国',salary:'晋升率38.1%；经营分享奖近9亿元，覆盖51%员工；薪资不封顶',url:ANKER_URL,urls:[ANKER_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ANKER_TEXT,raw_text:ANKER_TEXT,status:'待筛选',notes:'内推码：3S7SHME；投递时选择“大使推荐”；内推通道优先筛选/面试。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ANKER_KEY, '1');
    save();
  }
  function addPendingQyxdl() {
    if (localStorage.getItem(PENDING_QYXDL_KEY)) return;
    const job = makeJob({company:'启源芯动力',title:'2027 届校园招聘（研产销服供 / 电池银行与充换电运营 / 市场与创新业务）',city:'',salary:'具有竞争力的薪酬体系；完善的福利保障；绩效激励与成长奖励；多元职业发展通道',url:QYXDL_URL,urls:[QYXDL_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:QYXDL_TEXT,raw_text:QYXDL_TEXT,status:'待筛选',notes:'推荐码：EVVM9B；100+岗位；原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_QYXDL_KEY, '1');
    save();
  }
  function addPendingMetax() {
    if (localStorage.getItem(PENDING_METAX_KEY)) return;
    const job = makeJob({company:'沐曦股份',title:'2027 届校园招聘（硬件 / 软件 / 商务 / 管理）',city:'上海、南京、北京、成都、深圳、杭州、长沙',salary:'',url:METAX_URL,urls:[METAX_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:METAX_TEXT,raw_text:METAX_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2027 届海内外应届毕业生；岗位方向：硬件、软件、商务、管理；GPU/人工智能算力方向。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_METAX_KEY, '1');
    save();
  }
  function addPendingSunwoda() {
    if (localStorage.getItem(PENDING_SUNWODA_KEY)) return;
    const job = makeJob({company:'欣旺达',title:'2027 届全球校园招聘（研发 / 制造 / 职能 / 营销）',city:'深圳、惠州、南京、南昌、德阳、西安、金华、枣庄等20+城市',salary:'具备市场竞争力的全面薪酬体系',url:SUNWODA_URL,urls:[SUNWODA_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SUNWODA_TEXT,raw_text:SUNWODA_TEXT,status:'待筛选',notes:'推荐码：EVHT82（内推简历优先筛选）；每位同学最多投递2个志愿；招聘流程含网申、测评、AI面试、专业面试、Offer。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SUNWODA_KEY, '1');
    save();
  }
  function addPendingReo() {
    if (localStorage.getItem(PENDING_REO_KEY)) return;
    const job = makeJob({company:'睿联技术',title:'2027 届校园招聘（产品研发 / 销售运营 / 市场推广 / 职能支持）',city:'',salary:'',url:REO_URL,urls:[REO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:REO_TEXT,raw_text:REO_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：DSgvfVuR；智能视觉、智能算法相关方向。原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_REO_KEY, '1');
    save();
  }
  function mergePendingReoUpdate() {
    if (localStorage.getItem(PENDING_REO_UPDATE_KEY)) return;
    let job = state.jobs.find(j => normalize(j.company).includes('睿联') || getUrls(j).some(u => u.includes('/reo/136006')));
    if (!job) {
      job = makeJob({company:'睿联技术',title:'27 届秋季校园招聘（研发 / 销售运营 / 市场品牌 / 职能支持）',city:'深圳',salary:'研发类13-42W/年；销售运营类14-28W/年；市场品牌类14-25W/年；职能支持类13-28W/年',url:REO_UPDATED_URL,urls:[REO_UPDATED_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:REO_UPDATED_TEXT,raw_text:REO_UPDATED_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：DSrR9Tgr；网申页面填写推荐码，提高简历通过率。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    } else {
      const urls = getUrls(job);
      if (!urls.includes(REO_UPDATED_URL)) urls.push(REO_UPDATED_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '睿联技术';
      job.title = '27 届秋季校园招聘（研发 / 销售运营 / 市场品牌 / 职能支持）';
      job.city = '深圳';
      job.salary = '研发类13-42W/年；销售运营类14-28W/年；市场品牌类14-25W/年；职能支持类13-28W/年';
      job.type = '校招';
      job.tags = Array.from(new Set([...(job.tags || []), 'AI/Agent']));
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 后续补充招聘消息 ---\n${REO_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充推荐码：DSrR9Tgr；网申页面填写推荐码，提高简历通过率。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_REO_UPDATE_KEY, '1');
    save();
  }
  function addPendingCainiao() {
    if (localStorage.getItem(PENDING_CAINIAO_KEY)) return;
    const job = makeJob({company:'菜鸟',title:'2027 届应届生招聘（算法 / 研发 / 产品 / 运营 / 数据 / 物流 / 职能 / 销售）',city:'',salary:'',url:CAINIAO_URL,urls:[CAINIAO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CAINIAO_TEXT,raw_text:CAINIAO_TEXT,status:'待筛选',notes:'招聘方向：算法、研发、产品、运营、数据、物流、职能、销售；原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CAINIAO_KEY, '1');
    save();
  }
  function addPendingFandow() {
    if (localStorage.getItem(PENDING_FANDOW_KEY)) return;
    const urls = [FANDOW_URL, FANDOW_GROUP_URL, FANDOW_COLLECTION_URL];
    const job = makeJob({company:'凡岛',title:'27 届秋季校园招聘（日化产品 / 市场商务 / 广告营销 / 综合职能 / AI技术 / 财务管理）',city:'广州黄埔区',salary:'日化产品、市场商务、广告营销、综合职能类18-24W；AI技术类22-26W；财务管理类11-21W',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:FANDOW_TEXT,raw_text:FANDOW_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'内推码：DOY81JC；AI技术类包含 AI技术经理、AI工程师、AI产品经理；内推投递链接、秋招交流群和校招内推信息集合链接均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_FANDOW_KEY, '1');
    save();
  }
  function addPendingHikvision() {
    if (localStorage.getItem(PENDING_HIKVISION_KEY)) return;
    const job = makeJob({company:'海康威视',title:'2027 校园招聘',city:'',salary:'',url:HIKVISION_URL,urls:[HIKVISION_URL],linkParseStatus:'已解析',type:'校招',source:'图片/微信公众号',raw:HIKVISION_TEXT,raw_text:HIKVISION_TEXT,status:'待筛选',notes:'PC端（建议）：海康威视校招官网；移动端关注公众号“海康威视招聘”并点击“校园招聘”。若投递移动端“微简历”，还需登录 PC 端完善简历；招聘项目选择“2027校园招聘”。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HIKVISION_KEY, '1');
    save();
  }
  function addPendingUbtech() {
    if (localStorage.getItem(PENDING_UBTECH_KEY)) return;
    const job = makeJob({company:'优必选',title:'待确认（微信文章）',city:'',salary:'',url:UBTECH_URL,urls:[UBTECH_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:UBTECH_TEXT,raw_text:UBTECH_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，具体岗位、地点和招聘类型请人工打开文章确认。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_UBTECH_KEY, '1');
    save();
  }
  function addPendingTplinkGlobal() {
    if (localStorage.getItem(PENDING_TPLINK_GLOBAL_KEY)) return;
    const job = makeJob({company:'TP-Link联洲',title:'2027 届秋季校园招聘（研发 / 产品 / 营销 / 制造 / 供应链 / 人力 / 行政 / 财务 / 设计）',city:'未明确',salary:'行业高水平薪资；丰厚日常福利；节日惊喜',url:TPLINK_GLOBAL_URL,urls:[TPLINK_GLOBAL_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TPLINK_GLOBAL_TEXT,raw_text:TPLINK_GLOBAL_TEXT,status:'待筛选',notes:'推荐码：EV3GVK；原文提及中国、越南、巴西制造和供应体系，但未明确具体校招工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TPLINK_GLOBAL_KEY, '1');
    save();
  }
  function addPendingTplinkCn() {
    if (localStorage.getItem(PENDING_TPLINK_CN_KEY)) return;
    const job = makeJob({company:'TP-LINK（普联）',title:'2027 届秋季校园招聘（9大类岗位）',city:'',salary:'',url:TPLINK_CN_URL,urls:[TPLINK_CN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TPLINK_CN_TEXT,raw_text:TPLINK_CN_TEXT,status:'待筛选',notes:'内推码：XYDS013；需在提交简历前最后一栏“TP内推码”中填写；内推简历优先筛选。原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TPLINK_CN_KEY, '1');
    save();
  }
  function addPendingMoonton() {
    if (localStorage.getItem(PENDING_MOONTON_KEY)) return;
    const urls = [MOONTON_URL, MOONTON_GROUP_URL, MOONTON_COLLECTION_URL];
    const job = makeJob({company:'沐瞳科技',title:'2027 秋季校园招聘（产品 / 技术 / 美术 / 发行 / 职能）',city:'上海；全球多地',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:MOONTON_TEXT,raw_text:MOONTON_TEXT,status:'待筛选',notes:'内推码：KE79QVH；直接点击投递链接会自动填充内推码。手动填写时需选择“大使内推”。原文建议关注：游戏经历、项目/论文/竞赛、个人作品、英文能力。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_MOONTON_KEY, '1');
    save();
  }
  function addPendingCvte() {
    if (localStorage.getItem(PENDING_CVTE_KEY)) return;
    const job = makeJob({company:'CVTE视源股份',title:'2027 届全球校园招聘（软件 / 硬件 / 算法 / 商务 / 职能 / 制造质量 / 供应链 / 设计 / 研究）',city:'广州、苏州、合肥、西安、重庆、上海、武汉等',salary:'能力定薪；年度服务奖；绩效奖金；多项补贴',url:CVTE_URL,urls:[CVTE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CVTE_TEXT,raw_text:CVTE_TEXT,status:'待筛选',notes:'专属内推码：CVTEXAWSK；招聘来源选择“内部推荐”后填写内推码。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CVTE_KEY, '1');
    save();
  }
  function addPendingSzkingdom() {
    if (localStorage.getItem(PENDING_SZKINGDOM_KEY)) return;
    const urls = [SZKINGDOM_DIRECT_URL, SZKINGDOM_OFFICIAL_URL];
    const job = makeJob({company:'金证科技',title:'27 届校招&实习（C/C++ / Java / Web / 大模型应用 / 大模型算法等）',city:'深圳、上海、成都、长沙等',salary:'有竞争力的薪资；年度调薪；六险一金；2年免费住宿/租房补助',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SZKINGDOM_TEXT,raw_text:SZKINGDOM_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：ESKJB2；官网投递地址原文未带协议，已规范为 https://szkingdom1.zhiye.com/campus/jobs；岗位同时包含校招和实习。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SZKINGDOM_KEY, '1');
    save();
  }
  function addPendingHoymile() {
    if (localStorage.getItem(PENDING_HOYMILE_KEY)) return;
    const job = makeJob({company:'豪迈',title:'待确认（微信文章）',city:'',salary:'',url:HOYMILE_URL,urls:[HOYMILE_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:HOYMILE_TEXT,raw_text:HOYMILE_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HOYMILE_KEY, '1');
    save();
  }
  function addPendingChangyou() {
    if (localStorage.getItem(PENDING_CHANGYOU_KEY)) return;
    const job = makeJob({company:'搜狐畅游',title:'2027 届校园招聘（策划 / 开发 / 美术 / 测试 / 运营 / 职能 / 业务 / 技术）',city:'北京、重庆',salary:'',url:CHANGYOU_URL,urls:[CHANGYOU_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CHANGYOU_TEXT,raw_text:CHANGYOU_TEXT,status:'待筛选',notes:'招聘对象：2027届应届生；搜狐全资子公司；总部北京。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CHANGYOU_KEY, '1');
    save();
  }
  function addPendingQunar() {
    if (localStorage.getItem(PENDING_QUNAR_KEY)) return;
    const job = makeJob({company:'去哪儿旅行',title:'2027 届校园招聘（技术 / 产品 / 运营）',city:'北京、上海',salary:'',url:QUNAR_URL,urls:[QUNAR_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:QUNAR_TEXT,raw_text:QUNAR_TEXT,status:'待筛选',notes:'招聘对象：毕业时间2026年9月1日-2027年8月31日；福利包含“3+2”混合办公、弹性工作制、应届生旅游基金等。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_QUNAR_KEY, '1');
    save();
  }
  function addPendingTaisting() {
    if (localStorage.getItem(PENDING_TAISTING_KEY)) return;
    const urls = [TAISTING_URL, TAISTING_ALT_URL];
    const common = {city:'北京（总部）',salary:'未明确数额；实习期统一基本工资，之后按个人能力逐步上涨；年终奖金',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'PDF附件',raw:TAISTING_TEXT,raw_text:TAISTING_TEXT,status:'待筛选',notes:'招聘计划同时包含本科生正式岗位5名、研究生实习岗位3名；PDF未明确具体岗位对应的薪资数额。'};
    const jobs = [
      makeJob({company:'北京泰斯汀通信技术有限公司',title:'嵌入式软件开发工程师（本科正式岗 / 研究生实习）',...common}),
      makeJob({company:'北京泰斯汀通信技术有限公司',title:'嵌入式硬件开发工程师（本科正式岗 / 研究生实习）',...common})
    ];
    jobs.forEach(job => { if (!isDuplicate(job)) state.jobs.unshift(job); });
    localStorage.setItem(PENDING_TAISTING_KEY, '1');
    save();
  }
  function addPendingDfWeston() {
    if (localStorage.getItem(PENDING_DF_WESTON_KEY)) return;
    const common = {city:'烟台（岗位工作地点未明确）',salary:'',url:DF_WESTON_URL,urls:[DF_WESTON_URL],linkParseStatus:'已解析',type:'校招',source:'DOCX附件',raw:DF_WESTON_TEXT,raw_text:DF_WESTON_TEXT,status:'待筛选',notes:'国有企业；招聘对象为应届毕业生。文档另有二维码投递和扫码进群，但未提供可复制的文字链接；薪资未明确。'};
    const titles = ['结构设计（应届生）','软件研发（Java）（应届生）','国内方案营销（应届生）','软件研发（C语言）（应届生）','海外技术支持（应届生）','海外项目经理（应届生）','海外方案营销（应届生）','软件研发（嵌入式）（应届生）','硬件研发（应届生）'];
    titles.forEach(title => {
      const job = makeJob({company:'烟台东方威思顿电气有限公司',title,...common});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    });
    localStorage.setItem(PENDING_DF_WESTON_KEY, '1');
    save();
  }
  function addPendingIrobotics() {
    if (localStorage.getItem(PENDING_3IROBOTICS_KEY)) return;
    const job = makeJob({company:'杉川机器人',title:'2027 届杉尖计划校招（软件算法 / 硬件结构 / 产品项目 / 营销运营 / 供应链质量 / 平台职能）',city:'深圳、合肥、苏州',salary:'',url:IROBOTICS_URL,urls:[IROBOTICS_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:IROBOTICS_TEXT,raw_text:IROBOTICS_TEXT,status:'待筛选',notes:'学校专属推荐码：DSsd1zWy；校招流程：初筛→笔试→测评→业面→综面→Offer。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_3IROBOTICS_KEY, '1');
    save();
  }
  function addPendingAmec() {
    if (localStorage.getItem(PENDING_AMEC_KEY)) return;
    const job = makeJob({company:'中微公司',title:'待确认（微信文章）',city:'',salary:'',url:AMEC_URL,urls:[AMEC_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:AMEC_TEXT,raw_text:AMEC_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_AMEC_KEY, '1');
    save();
  }
  function addPendingLiulian() {
    if (localStorage.getItem(PENDING_LIULIAN_KEY)) return;
    const job = makeJob({company:'六联智能',title:'待确认（微信文章）',city:'',salary:'',url:LIULIAN_URL,urls:[LIULIAN_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:LIULIAN_TEXT,raw_text:LIULIAN_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_LIULIAN_KEY, '1');
    save();
  }
  function addPendingHisenseIm() {
    if (localStorage.getItem(PENDING_HISENSE_IM_KEY)) return;
    const job = makeJob({company:'海信国际营销',title:'待确认（微信文章）',city:'',salary:'',url:HISENSE_IM_URL,urls:[HISENSE_IM_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:HISENSE_IM_TEXT,raw_text:HISENSE_IM_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HISENSE_IM_KEY, '1');
    save();
  }
  function addPendingHisensePoster() {
    if (localStorage.getItem(PENDING_HISENSE_POSTER_KEY)) return;
    const job = makeJob({company:'海信集团',title:'2027 届校园招聘空中宣讲会',city:'待确认',salary:'',url:'',urls:[],linkParseStatus:'需人工打开',type:'校招',source:'图片/海报',raw:HISENSE_POSTER_TEXT,raw_text:HISENSE_POSTER_TEXT,status:'待筛选',notes:'宣讲时间：9月3日（周四）19:00；海报含预约直播二维码，但未提供可复制的投递 URL，请扫码或通过海信集团招聘官方渠道查看。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HISENSE_POSTER_KEY, '1');
    save();
  }
  function addPendingHorizon() {
    if (localStorage.getItem(PENDING_HORIZON_KEY)) return;
    const urls = [HORIZON_REFERRAL_URL, HORIZON_OFFICIAL_URL];
    const job = makeJob({company:'地平线',title:'2027 届秋季校园招聘（算法 / 芯片 / 软件 / 硬件 / 测试 / 业务拓展）',city:'北京、上海、南京、杭州、成都、西安、深圳等',salary:'基础薪资+绩效奖金+各类福利补贴',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HORIZON_TEXT,raw_text:HORIZON_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'官网投递时选择“校园招聘”，填写内推码：ogyqlc；招聘对象为2026年9月1日至2027年8月31日毕业的海内外应届毕业生。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HORIZON_KEY, '1');
    save();
  }
  function mergeHorizonAutumnUpdate() {
    if (localStorage.getItem(PENDING_HORIZON_AUTUMN_UPDATE_KEY)) return;
    let job = state.jobs.find(j => normalize(j.company).includes('地平线') || getUrls(j).some(url => url.includes('horizon') || url.includes('csfylp')));
    if (!job) {
      job = makeJob({company:'地平线',title:'2027届秋季校园招聘正式批（算法 / 芯片 / 软件 / 硬件 / 测试 / 业务拓展）',city:'北京、上海、南京、杭州、成都、西安、深圳等',salary:'',url:HORIZON_AUTUMN_URL,urls:[HORIZON_AUTUMN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HORIZON_AUTUMN_TEXT,raw_text:HORIZON_AUTUMN_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2026年9月1日至2027年8月31日毕业的海内外应届毕业生；正式批投递链接已保留。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    } else {
      const urls = getUrls(job);
      if (!urls.includes(HORIZON_AUTUMN_URL)) urls.push(HORIZON_AUTUMN_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '地平线';
      job.title = '2027届秋季校园招聘正式批（算法 / 芯片 / 软件 / 硬件 / 测试 / 业务拓展）';
      job.city = '北京、上海、南京、杭州、成都、西安、深圳等';
      job.type = '校招';
      job.linkParseStatus = '已解析';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 秋季正式批补充信息 ---\n${HORIZON_AUTUMN_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充正式批投递链接、招聘对象、岗位方向、城市和流程；原有链接保留。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_HORIZON_AUTUMN_UPDATE_KEY, '1');
    save();
  }
  function addPendingEmdoor() {
    if (localStorage.getItem(PENDING_EMDOOR_KEY)) return;
    const urls = [EMDOOR_URL, EMDOOR_GROUP_URL, EMDOOR_COLLECTION_URL];
    const job = makeJob({company:'亿道集团',title:'2027 届校园招聘（研发 / 智能制造管培 / 采购 / 成本 / 人力资源）',city:'深圳、重庆',salary:'本科10-27W；硕士20-35W',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:EMDOOR_TEXT,raw_text:EMDOOR_TEXT,status:'待筛选',notes:'内推码：ESKPAV；研发岗包含产品、项目、嵌入式软件、算法、硬件、结构、热设计、测试；非研发岗不限专业。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_EMDOOR_KEY, '1');
    save();
  }
  function addPendingKelong() {
    if (localStorage.getItem(PENDING_KELONG_KEY)) return;
    const job = makeJob({company:'科华集团',title:'待确认（微信文章）',city:'',salary:'',url:KELONG_URL,urls:[KELONG_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:KELONG_TEXT,raw_text:KELONG_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_KELONG_KEY, '1');
    save();
  }
  function addPendingSpeech() {
    if (localStorage.getItem(PENDING_SPEECH_KEY)) return;
    const job = makeJob({company:'思特奇',title:'待确认（微信文章）',city:'',salary:'',url:SPEECH_URL,urls:[SPEECH_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:SPEECH_TEXT,raw_text:SPEECH_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SPEECH_KEY, '1');
    save();
  }
  function addPendingCetc55() {
    if (localStorage.getItem(PENDING_CETC55_KEY)) return;
    const job = makeJob({company:'中国电科五十五所',title:'待确认（微信文章）',city:'',salary:'',url:CETC55_URL,urls:[CETC55_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CETC55_TEXT,raw_text:CETC55_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CETC55_KEY, '1');
    save();
  }
  function addPendingZhuoyu() {
    if (localStorage.getItem(PENDING_ZHUOYU_KEY)) return;
    const job = makeJob({company:'卓驭',title:'2027 届校园招聘（算法 / 软件 / 机械电气 / 嵌入式 / 测试 / 安全 / 系统工程等）',city:'',salary:'有竞争力的薪酬；住房补贴等多方位福利',url:ZHUOYU_URL,urls:[ZHUOYU_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ZHUOYU_TEXT,raw_text:ZHUOYU_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：ESSPGB；招聘方向包含大模型算法、智能驾驶和移动物理AI相关岗位；原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ZHUOYU_KEY, '1');
    save();
  }
  function addPendingBoke() {
    if (localStorage.getItem(PENDING_BOKE_KEY)) return;
    const job = makeJob({company:'波克',title:'27 届秋季校园招聘（研发 / 美术 / 策划 / 发行 / 职能 / 技术）',city:'上海市普陀区',salary:'行业竞争力薪酬；免费三餐；租房补贴；年度带薪旅游等',url:BOKE_URL,urls:[BOKE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:BOKE_TEXT,raw_text:BOKE_TEXT,status:'待筛选',notes:'专业不限；上海游戏公司；欢迎热爱游戏的同学加入。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BOKE_KEY, '1');
    save();
  }
  function addPendingHangtianDadao() {
    if (localStorage.getItem(PENDING_HANGTIAN_DADAO_KEY)) return;
    const job = makeJob({company:'航天大道',title:'待确认（微信文章）',city:'',salary:'',url:HANGTIAN_DADAO_URL,urls:[HANGTIAN_DADAO_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:HANGTIAN_DADAO_TEXT,raw_text:HANGTIAN_DADAO_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HANGTIAN_DADAO_KEY, '1');
    save();
  }
  function addPendingManbang() {
    if (localStorage.getItem(PENDING_MANBANG_KEY)) return;
    const job = makeJob({company:'满帮集团',title:'2027 届校园招聘（算法 / 全栈开发 / 数据 / 安全 / 自动驾驶 / 产品 / 运营等）',city:'南京、苏州、上海、北京',salary:'',url:MANBANG_URL,urls:[MANBANG_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:MANBANG_TEXT,raw_text:MANBANG_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：DSP2bKg3；招聘对象为2027届海内外高校应届毕业生，毕业时间2026.10-2027.09；网申周期8.26-11.30。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_MANBANG_KEY, '1');
    save();
  }
  function addPendingHuaweiWireless() {
    if (localStorage.getItem(PENDING_HUAWEI_WIRELESS_KEY)) return;
    const common = {city:'',salary:'',url:HUAWEI_CAREER_URL,urls:[HUAWEI_CAREER_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HUAWEI_WIRELESS_TEXT,raw_text:HUAWEI_WIRELESS_TEXT,status:'待筛选',notes:'部门：ICT BG-无线网络研发部；官网投递选择“应届生”，关键字搜索应届生岗位（本硕）；原文未明确工作地点。'};
    const roles = [
      ['AI模型工程师（AI算法 / 后训练与强化学习 / Agent技术）',['AI/Agent']],
      ['AI应用工程师（AI技术应用）',['AI/Agent']],
      ['软件开发工程师（通用软件开发工程师）',[]],
      ['算法工程师（通信算法 / 仿真算法 / 感知算法）',[]]
    ];
    roles.forEach(([title,tags]) => {
      const job = makeJob({company:'华为',title,...common,tags});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    });
    localStorage.setItem(PENDING_HUAWEI_WIRELESS_KEY, '1');
    save();
  }
  function addPendingGiti() {
    if (localStorage.getItem(PENDING_GITI_KEY)) return;
    const job = makeJob({company:'佳通轮胎',title:'2027 届校园招聘（研发 / 制造 / 质量 / 供应链 / 计算机 / 职能管理）',city:'上海、合肥、莆田、牡丹江等',salary:'',url:GITI_URL,urls:[GITI_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:GITI_TEXT,raw_text:GITI_TEXT,status:'待筛选',notes:'招聘对象：2027届毕业生及符合岗位要求的在校生、应届生；投递时在“经验”中选择“应届生”。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_GITI_KEY, '1');
    save();
  }
  function addPendingWanneng() {
    if (localStorage.getItem(PENDING_WANNENG_KEY)) return;
    const common = {city:'湖州（总部所在地；岗位工作地点未明确）',salary:'',url:WANNENG_URL,urls:[WANNENG_URL],linkParseStatus:'已解析',type:'校招',source:'DOCX附件',raw:WANNENG_TEXT,raw_text:WANNENG_TEXT,status:'待筛选',notes:'上市公司；招聘对象为应届毕业生；文档另有二维码投递和扫码进群，但未提供可复制的文字链接；岗位工作地点和薪资未明确。'};
    const titles = ['汽机工程师助理（应届生）','锅炉工程师助理（运行）（应届生）','热控工程师助理（运营）（应届生）'];
    titles.forEach(title => {
      const job = makeJob({company:'旺能环境股份有限公司',title,...common});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    });
    localStorage.setItem(PENDING_WANNENG_KEY, '1');
    save();
  }
  function addPendingGeekplus() {
    if (localStorage.getItem(PENDING_GEEKPLUS_KEY)) return;
    const job = makeJob({company:'极智嘉',title:'待确认（微信文章）',city:'',salary:'',url:GEEKPLUS_URL,urls:[GEEKPLUS_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:GEEKPLUS_TEXT,raw_text:GEEKPLUS_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_GEEKPLUS_KEY, '1');
    save();
  }
  function addPendingRongzhi() {
    if (localStorage.getItem(PENDING_RONGZHI_KEY)) return;
    const common = {city:'',type:'校招',source:'PDF附件',raw:RONGZHI_TEXT,raw_text:RONGZHI_TEXT,status:'待筛选',url:RONGZHI_URL,urls:[RONGZHI_URL],linkParseStatus:'已解析',notes:'招聘对象为应届毕业生；PDF未明确工作地点。内推码：DSqpVauD；福利包含五险一金、餐补、话补、交通补贴、租房补贴、带薪年假、健康体检、弹性工作时间等。'};
    const roles = [
      ['AI算法工程师-R&D',2,'硕士及以上','17000-21000元/月','计算机、应用数学、人工智能等相关专业',['AI/Agent']],
      ['AI算法工程师-S&V',2,'硕士及以上','17000-21000元/月','计算机、人工智能、数学、信号处理等相关专业',['AI/Agent']],
      ['PHM算法工程师',2,'硕士及以上','17000-21000元/月','故障诊断、机械、人工智能、统计学等相关专业',['AI/Agent']],
      ['大模型应用/智能体开发工程师',2,'硕士及以上','17000-21000元/月','人工智能、计算机、应用数学、统计学等相关专业',['AI/Agent']],
      ['硬件产品经理',2,'本科及以上','14000-20000元/月','通信工程、电子信息工程、自动化、计算机科学、人工智能、机电一体化等相关专业',[]],
      ['软件产品经理',1,'本科及以上','14000-20000元/月','计算机科学、人工智能、统计学、通信工程、电子信息工程等相关专业',[]],
      ['硬件开发工程师',3,'本科及以上','14000-19000元/月','电子、通信、自动化等相关专业',[]],
      ['传感器开发工程师',1,'本科及以上','14000-19000元/月','电子、机械、智能感知工程、测控、微机电系统工程等相关专业',[]],
      ['软件开发工程师',4,'本科及以上','14000-19000元/月','计算机、软件等相关专业',[]],
      ['嵌入式软件开发工程师',3,'本科及以上','14000-20000元/月','计算机、电子、通信、自动化等相关专业',[]],
      ['智能策略软件开发工程师',2,'本科及以上','14000-20000元/月','信号处理、计算机科学、电子信息、自动化等相关专业',[]],
      ['软件测试工程师',2,'本科及以上','10000-15000元/月','通信、电子、计算机、软件等相关专业',[]],
      ['硬件测试工程师',1,'本科及以上','10000-15000元/月','电子、通信、计算机、自动化等相关专业',[]],
      ['诊断技术工程师',14,'硕士及以上','15000-17000元/月','理工科相关专业',[]],
      ['解决方案经理',5,'本科及以上','11000-16000元/月','理工科相关专业',[]],
      ['市场分析专员',1,'硕士及以上','12000-15000元/月','理工科相关专业',[]],
      ['市场推广专员',1,'本科及以上','10000-15000元/月','市场营销、新闻传播、金融等相关专业',[]],
      ['数字化运营专员',2,'本科及以上','10000-15000元/月','计算机、数据科学、应用统计、市场营销、电子商务等相关专业',[]],
      ['商务专员',1,'本科及以上','10000-14000元/月','工商管理、市场营销、财务、统计学等相关专业',[]],
      ['生产工程师',2,'本科及以上','10000-14000元/月','理工科相关专业',[]],
      ['生产计划工程师',1,'本科及以上','10000-14000元/月','理工科相关专业',[]],
      ['客户质量工程师',2,'本科及以上','10000-14000元/月','机械、自动化、电子、电气、测控、材料、工业工程、质量管理等相关专业',[]],
      ['培训运营专员',1,'本科及以上','10000-14000元/月','专业不限',[]],
      ['运营专员',1,'本科及以上','10000-14000元/月','专业不限',[]],
      ['采购专员',2,'本科及以上','10000-14000元/月','理工科相关专业',[]],
      ['财务专员',2,'本科及以上','10000-14000元/月','专业不限',[]],
      ['品牌专员',1,'本科及以上','10000-14000元/月','新闻、广播电视、广告等相关专业',[]],
      ['IT工程师',1,'本科及以上','10000-14000元/月','计算机、软件工程、信息管理、电子信息等相关专业',[]]
    ];
    roles.forEach(([title,headcount,education,salary,majors,tags]) => {
      const job = makeJob({company:'安徽容知日新科技股份有限公司',title,headcount,education,salary,majors,tags,...common});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    });
    localStorage.setItem(PENDING_RONGZHI_KEY, '1');
    save();
  }
  function mergeRongzhiUpdate() {
    if (localStorage.getItem(PENDING_RONGZHI_UPDATE_KEY)) return;
    const jobs = state.jobs.filter(j => normalize(j.company).includes('容知日新'));
    const extraUrls = [RONGZHI_KDOCS_URL, RONGZHI_GROUP_URL, RONGZHI_COLLECTION_URL];
    jobs.forEach(job => {
      const urls = getUrls(job);
      extraUrls.forEach(url => { if (!urls.includes(url)) urls.push(url); });
      job.urls = urls;
      job.url = urls.join('\n');
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充招聘消息 ---\n${RONGZHI_UPDATE_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}已补充招聘简章、交流群和校招信息集合链接；本次消息薪资概览为10-21K。`;
      job.updatedAt = Date.now();
    });
    localStorage.setItem(PENDING_RONGZHI_UPDATE_KEY, '1');
    save();
  }
  function addPendingDescente() {
    if (localStorage.getItem(PENDING_DESCENTE_KEY)) return;
    const job = makeJob({company:'迪桑特',title:'27 届秋招正式批（电商运营 / 商品运营 / 零售管理）',city:'上海及全国多地',salary:'',url:DESCENTE_URL,urls:[DESCENTE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:DESCENTE_TEXT,raw_text:DESCENTE_TEXT,status:'待筛选',notes:'招聘对象：2027届高校毕业生；原文说明可添加微信并回复“迪桑特”获取投递链接及求职资料，本工具不自动添加微信。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_DESCENTE_KEY, '1');
    save();
  }
  function mergeIroboticsUpdate() {
    if (localStorage.getItem(PENDING_3IROBOTICS_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('杉川') || getUrls(j).some(url => url.includes('/3irobotics/147137')));
    if (!job) {
      const newJob = makeJob({company:'杉川机器人',title:'杉尖计划 2027 届校园招聘（软件算法 / 硬件结构 / 产品项目 / 供应链质量 / 营销运营 / 平台职能）',city:'深圳、合肥、苏州',salary:'行业高薪激励',url:IROBOTICS_UPDATED_URL,urls:[IROBOTICS_UPDATED_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:IROBOTICS_UPDATED_TEXT,raw_text:IROBOTICS_UPDATED_TEXT,status:'待筛选',notes:'推荐码：DSJVWK3N；毕业时间2026.09-2027.08。'});
      if (!isDuplicate(newJob)) state.jobs.unshift(newJob);
    } else {
      const urls = getUrls(job);
      if (!urls.includes(IROBOTICS_UPDATED_URL)) urls.push(IROBOTICS_UPDATED_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '杉川机器人';
      job.title = '杉尖计划 2027 届校园招聘（软件算法 / 硬件结构 / 产品项目 / 供应链质量 / 营销运营 / 平台职能）';
      job.city = '深圳、合肥、苏州';
      job.type = '校招';
      job.salary = '行业高薪激励';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充招聘消息 ---\n${IROBOTICS_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充推荐码：DSJVWK3N；毕业时间2026.09-2027.08；杉尖计划培养信息已追加。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_3IROBOTICS_UPDATE_KEY, '1');
    save();
  }
  function addPendingChipsea() {
    if (localStorage.getItem(PENDING_CHIPSEA_KEY)) return;
    const job = makeJob({company:'芯海科技',title:'2027 届校园招聘（全信号链芯片 / 算法 / AI边缘智能硬件方向）',city:'深圳、北京、上海、成都、合肥、西安、香港、新加坡',salary:'',url:CHIPSEA_URL,urls:[CHIPSEA_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CHIPSEA_TEXT,raw_text:CHIPSEA_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：EVKWS0；国内高校毕业时间2027.01.01-2027.12.31；海外高校毕业时间2026.01.01-2027.12.31；原文登录地址未带协议，已规范为 https://chipsea.zhiye.com/campus/jobs。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CHIPSEA_KEY, '1');
    save();
  }
  function addPendingJee() {
    if (localStorage.getItem(PENDING_JEE_KEY)) return;
    const job = makeJob({company:'巨一科技股份有限公司（JEE）',title:'2027 届校园招聘（研发技术 / 算法软件 / 具身智能 / 制造技术 / 职能 / 销售支持 / 供应链）',city:'合肥',salary:'',url:JEE_URL,urls:[JEE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:JEE_TEXT,raw_text:JEE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'总部合肥；招聘方向包含算法软件、具身智能及新能源汽车电驱动系统智能制造；推荐码：DSwFMzGC。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_JEE_KEY, '1');
    save();
  }
  function addPendingNinebot() {
    if (localStorage.getItem(PENDING_NINEBOT_KEY)) return;
    const urls = [NINEBOT_QR_URL, NINEBOT_URL];
    const job = makeJob({company:'九号公司',title:'2027 届校园招聘（研发 / 产品 / 设计 / 营销 / 供应链 / 职能 / 质量）',city:'常州、北京、上海、深圳、杭州、珠海',salary:'优厚薪资福利',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:NINEBOT_TEXT,raw_text:NINEBOT_TEXT,status:'待筛选',notes:'26/27届均可投，岗位投递无数量限制；内推码：DSMjRrNg；流程：网申→笔试→面试→发Offer。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_NINEBOT_KEY, '1');
    save();
  }
  function addPendingUnilumin() {
    if (localStorage.getItem(PENDING_UNILUMIN_KEY)) return;
    const job = makeJob({company:'洲明科技',title:'2027 届秋季校园招聘（研发 / 市场 / 产品 / 智能制造 / 供应链 / 职能）',city:'',salary:'行业TOP级；最高可达40W',url:UNILUMIN_URL,urls:[UNILUMIN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:UNILUMIN_TEXT,raw_text:UNILUMIN_TEXT,status:'待筛选',notes:'推荐码：ESKMAK；每年2次晋升调薪机会；原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_UNILUMIN_KEY, '1');
    save();
  }
  function addPendingCasc() {
    if (localStorage.getItem(PENDING_CASC_KEY)) return;
    const job = makeJob({company:'航天科技集团',title:'待确认（微信文章）',city:'',salary:'',url:CASC_URL,urls:[CASC_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CASC_TEXT,raw_text:CASC_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CASC_KEY, '1');
    save();
  }
  function addPendingCmb() {
    if (localStorage.getItem(PENDING_CMB_KEY)) return;
    const job = makeJob({company:'招商银行',title:'待确认（微信文章）',city:'',salary:'',url:CMB_URL,urls:[CMB_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CMB_TEXT,raw_text:CMB_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CMB_KEY, '1');
    save();
  }
  function addPendingLeihu() {
    if (localStorage.getItem(PENDING_LEIHU_KEY)) return;
    const job = makeJob({company:'网易游戏雷火',title:'2027 届秋招正式批双选会（引擎图形 / 客户端服务端 / 研发测试 / 策划美术 / AI智能体）',city:'杭州',salary:'',url:LEIHU_URL,urls:[LEIHU_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:LEIHU_TEXT,raw_text:LEIHU_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'面向2027届理工科在读学生（本科/硕士/博士）；扫描二维码参与双选会，选择岗位方向获取专属投递链接。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_LEIHU_KEY, '1');
    save();
  }
  function addPendingXuzhiyuan() {
    if (localStorage.getItem(PENDING_XUZHIYUAN_KEY)) return;
    const job = makeJob({company:'旭之源',title:'待确认（微信文章）',city:'',salary:'',url:XUZHIYUAN_URL,urls:[XUZHIYUAN_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:XUZHIYUAN_TEXT,raw_text:XUZHIYUAN_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_XUZHIYUAN_KEY, '1');
    save();
  }
  function addPendingCitic() {
    if (localStorage.getItem(PENDING_CITIC_KEY)) return;
    const job = makeJob({company:'中信集团',title:'待确认（微信文章）',city:'',salary:'',url:CITIC_URL,urls:[CITIC_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CITIC_TEXT,raw_text:CITIC_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CITIC_KEY, '1');
    save();
  }
  function addPendingZte() {
    if (localStorage.getItem(PENDING_ZTE_KEY)) return;
    const job = makeJob({company:'中兴通讯',title:'待确认（微信文章）',city:'',salary:'',url:ZTE_URL,urls:[ZTE_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:ZTE_TEXT,raw_text:ZTE_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ZTE_KEY, '1');
    save();
  }
  function addPendingYongzhuo() {
    if (localStorage.getItem(PENDING_YONGZHUO_KEY)) return;
    const job = makeJob({company:'永卓控股',title:'待确认（微信文章）',city:'',salary:'',url:YONGZHUO_URL,urls:[YONGZHUO_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:YONGZHUO_TEXT,raw_text:YONGZHUO_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_YONGZHUO_KEY, '1');
    save();
  }
  function addPendingNorthernIc() {
    if (localStorage.getItem(PENDING_NORTHERN_IC_KEY)) return;
    const job = makeJob({company:'北方集成电路',title:'待确认（微信文章）',city:'',salary:'',url:NORTHERN_IC_URL,urls:[NORTHERN_IC_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:NORTHERN_IC_TEXT,raw_text:NORTHERN_IC_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_NORTHERN_IC_KEY, '1');
    save();
  }
  function addPendingBjSpaceTest() {
    if (localStorage.getItem(PENDING_BJ_SPACE_TEST_KEY)) return;
    const job = makeJob({company:'北京航天试验技术研究所',title:'待确认（微信文章）',city:'',salary:'',url:BJ_SPACE_TEST_URL,urls:[BJ_SPACE_TEST_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:BJ_SPACE_TEST_TEXT,raw_text:BJ_SPACE_TEST_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BJ_SPACE_TEST_KEY, '1');
    save();
  }
  function addPendingSgmw() {
    if (localStorage.getItem(PENDING_SGMW_KEY)) return;
    const job = makeJob({company:'上汽通用五菱',title:'待确认（微信文章）',city:'',salary:'',url:SGMW_URL,urls:[SGMW_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:SGMW_TEXT,raw_text:SGMW_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SGMW_KEY, '1');
    save();
  }
  function addPendingCisdi() {
    if (localStorage.getItem(PENDING_CISDI_KEY)) return;
    const job = makeJob({company:'中冶赛迪集团有限公司',title:'2027 届校园招聘（专业方向待查看）',city:'重庆、北京、上海、西安、成都、深圳；英国、俄罗斯、巴西、越南、马来西亚、土耳其等',salary:'行业内有竞争力薪酬；优秀人才一人一薪；七险二金及多项补贴',url:CISDI_URL,urls:[CISDI_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CISDI_TEXT,raw_text:CISDI_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'需求专业包含计算机、软件工程、人工智能、自动化、电子信息、数学等；具体职位名称原文未列出；网申地址已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CISDI_KEY, '1');
    save();
  }
  function mergeCisdiUpdate() {
    if (localStorage.getItem(PENDING_CISDI_UPDATE_KEY)) return;
    let job = state.jobs.find(j => normalize(j.company).includes('中冶赛迪') || getUrls(j).some(url => url.includes('CtmID=8906856')));
    if (!job) {
      job = makeJob({company:'中冶赛迪集团有限公司',title:'2027届校园招聘（9月16日北京科技大学宣讲会）',city:'重庆、上海、北京、西安、成都、深圳；英国、俄罗斯、巴西、越南、马来西亚、印度尼西亚、土耳其等',salary:'行业内有竞争力薪酬；优秀人才一人一薪；七险二金及多项补贴',url:[CISDI_FAIR_URL,CISDI_URL].join('\n'),urls:[CISDI_FAIR_URL,CISDI_URL],linkParseStatus:'已解析',type:'校招',source:'校园宣讲会',raw:CISDI_UPDATE_TEXT,raw_text:CISDI_UPDATE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'宣讲时间：2026年9月16日19:00-21:00；地点：时代凌宇报告厅；详细专业和网申链接已保留。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    } else {
      const urls = getUrls(job);
      [CISDI_FAIR_URL, CISDI_URL].forEach(url => { if (!urls.includes(url)) urls.push(url); });
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '中冶赛迪集团有限公司';
      job.title = '2027届校园招聘（9月16日北京科技大学宣讲会）';
      job.city = '重庆、上海、北京、西安、成都、深圳；英国、俄罗斯、巴西、越南、马来西亚、印度尼西亚、土耳其等';
      job.type = '校招';
      job.linkParseStatus = '已解析';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 9月16日宣讲补充信息 ---\n${CISDI_UPDATE_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充9月16日北京科技大学宣讲时间、地点、详细专业、福利和工作地点；详情链接及网申地址已保留。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_CISDI_UPDATE_KEY, '1');
    save();
  }
  function addPendingZtsteel() {
    if (localStorage.getItem(PENDING_ZTSTEEL_KEY)) return;
    const job = makeJob({company:'中天钢铁集团',title:'2027届北科大专场招聘（宣讲会 / 校园招聘会）',city:'常州、南通、淮安',salary:'本科12.5万/年起；研究生18万/年起；博士面议并分配产权住房',url:ZTSTEEL_URL,urls:[ZTSTEEL_URL],linkParseStatus:'已解析',type:'校招',source:'校园招聘会',raw:ZTSTEEL_TEXT,raw_text:ZTSTEEL_TEXT,status:'待筛选',notes:'专场宣讲会：2027年9月17日19:00-21:00，时代凌宇报告厅；校园招聘会：2027年9月18日9:00-12:00，H26；联系人及电话已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ZTSTEEL_KEY, '1');
    save();
  }
  function addPendingYadea() {
    if (localStorage.getItem(PENDING_YADEA_KEY)) return;
    const job = makeJob({company:'雅迪科技集团有限公司',title:'2027届秋季校园招聘（营销 / 嵌入式软硬件 / 电气部品 / 售后 / 市场 / 电商）',city:'深圳、杭州、武汉、郑州、无锡',salary:'',url:YADEA_URL,urls:[YADEA_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:YADEA_TEXT,raw_text:YADEA_TEXT,status:'待筛选',notes:`招聘交流群：${YADEA_GROUP_URL}；具体岗位要求和招聘安排以职位页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_YADEA_KEY, '1');
    save();
  }
  function addPendingSpringAirlines() {
    if (localStorage.getItem(PENDING_SPRING_AIRLINES_KEY)) return;
    const job = makeJob({company:'春秋航空股份有限公司',title:'2027届秋季校园招聘（航空工程 / 服务管理 / 市场管理 / IT产品 / 运营 / 财务 / 算法）',city:'上海、扬州',salary:'',url:SPRING_AIRLINES_URL,urls:[SPRING_AIRLINES_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SPRING_AIRLINES_TEXT,raw_text:SPRING_AIRLINES_TEXT,status:'待筛选',tags:['AI/Agent'],notes:`招聘交流群：${SPRING_AIRLINES_GROUP_URL}；具体岗位要求和招聘安排以职位页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SPRING_AIRLINES_KEY, '1');
    save();
  }
  function addPendingCaterpillar() {
    if (localStorage.getItem(PENDING_CATERPILLAR_KEY)) return;
    const job = makeJob({company:'卡特彼勒（中国）投资有限公司',title:'2027届秋季校园招聘（数据科学 / 智能制造 / 产品技术 / 供应链 / 电子软件 / 新能源研发）',city:'上海、天津、青岛、无锡、徐州等',salary:'',url:CATERPILLAR_URL,urls:[CATERPILLAR_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CATERPILLAR_TEXT,raw_text:CATERPILLAR_TEXT,status:'待筛选',tags:['AI/Agent'],notes:`招聘交流群：${CATERPILLAR_GROUP_URL}；具体岗位要求和招聘安排以职位页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CATERPILLAR_KEY, '1');
    save();
  }
  function addPendingTbea() {
    if (localStorage.getItem(PENDING_TBEA_KEY)) return;
    const job = makeJob({company:'特变电工股份有限公司',title:'2027届秋季校园招聘（研发 / 销售技术支持 / 电缆研发 / 技术营销 / 国际销售）',city:'北京、泰安、昌吉、扬州',salary:'',url:TBEA_URL,urls:[TBEA_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TBEA_TEXT,raw_text:TBEA_TEXT,status:'待筛选',notes:`招聘交流群：${TBEA_GROUP_URL}；具体岗位要求和招聘安排以职位页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TBEA_KEY, '1');
    save();
  }
  function addPendingYutong() {
    if (localStorage.getItem(PENDING_YUTONG_KEY)) return;
    const urls = [YUTONG_JOBS_URL, YUTONG_TRACK_URL, YUTONG_APPLY_URL];
    const job = makeJob({company:'宇通集团',title:'2027届校招正式批（管培 / 生产运营 / 销售 / 售后 / 研发技术 / 职能）',city:'',salary:'硕士年薪上限40万元；本科年薪上限28万元',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:YUTONG_TEXT,raw_text:YUTONG_TEXT,status:'待筛选',notes:'招聘规模：本科生700个、硕士生300个；30个岗位清单、应聘跟进群和宇通校招官网链接均已保留；具体工作地点以岗位页面为准。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_YUTONG_KEY, '1');
    save();
  }
  function addPendingSmartmore() {
    if (localStorage.getItem(PENDING_SMARTMORE_KEY)) return;
    const job = makeJob({company:'思谋科技 SmartMore',title:'2027届校园招聘（算法研发 / 软件工程 / 产品项目 / 职能管培）',city:'',salary:'',url:SMARTMORE_URL,urls:[SMARTMORE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SMARTMORE_TEXT,raw_text:SMARTMORE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：27届本硕博应届生；原文未明确工作地点和薪资；投递链接已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SMARTMORE_KEY, '1');
    save();
  }
  function addPendingKnightGroup() {
    if (localStorage.getItem(PENDING_KNIGHT_GROUP_KEY)) return;
    const job = makeJob({company:'骑士集团',title:'2027届综合管培生计划（高管带教 / 产品市场运营轮岗）',city:'',salary:'年薪16-20W',url:KNIGHT_GROUP_URL,urls:[KNIGHT_GROUP_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:KNIGHT_GROUP_TEXT,raw_text:KNIGHT_GROUP_TEXT,status:'待筛选',notes:'面向对象：2027届；原文未明确工作地点；投递链接已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_KNIGHT_GROUP_KEY, '1');
    save();
  }
  function addPendingImou() {
    if (localStorage.getItem(PENDING_IMOU_KEY)) return;
    const job = makeJob({company:'华橙网络（乐橙 Imou）',title:'2027届全球校园招聘（软件研发 / 算法 / 研发产品 / 营销 / 市场产品）',city:'杭州、西安',salary:'',url:IMOU_URL,urls:[IMOU_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:IMOU_TEXT,raw_text:IMOU_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'学校专属推荐码：ESVP8B；具体岗位要求和招聘安排以职位页面为准。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_IMOU_KEY, '1');
    save();
  }
  function addPendingMultifields() {
    if (localStorage.getItem(PENDING_MULTIFIELDS_KEY)) return;
    const urls = [MULTIFIELDS_APPLY_URL, MULTIFIELDS_SITE_URL];
    const job = makeJob({company:'多场低温科技（北京）有限公司',title:'2027届校园招聘（机械 / 光学 / 物性测量 / 低温磁场 / 电路 / 算法 / 传感 / 减振）',city:'北京、上海、合肥',salary:'行业领先的薪资；绩效奖金；长期激励',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'图片',raw:MULTIFIELDS_TEXT,raw_text:MULTIFIELDS_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'品牌：多场科技 MultiFields；招聘对象为2027届毕业生，国内应届生毕业时间2026.9-2027.7，留学生应届生毕业时间2027.1-2027.7；HR邮箱：liyang@multifields.com；图片二维码投递说明已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_MULTIFIELDS_KEY, '1');
    save();
  }
  function addPendingTaikang() {
    if (localStorage.getItem(PENDING_TAIKANG_KEY)) return;
    const job = makeJob({company:'泰康保险集团股份有限公司',title:'2027届秋季校园招聘（数据科学 / 金融服务运营 / 云计算 / 智能体 / 算法 / AI安全）',city:'北京、武汉、济南',salary:'',url:TAIKANG_URL,urls:[TAIKANG_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TAIKANG_TEXT,raw_text:TAIKANG_TEXT,status:'待筛选',tags:['AI/Agent'],notes:`招聘交流群：${TAIKANG_GROUP_URL}；具体岗位要求和招聘安排以职位页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TAIKANG_KEY, '1');
    save();
  }
  function addPendingTranssion() {
    if (localStorage.getItem(PENDING_TRANSSION_KEY)) return;
    const job = makeJob({company:'深圳传音控股股份有限公司',title:'2027届秋季校园招聘（采购 / AI专项 / 采购管培生 / 海外综合采购）',city:'深圳、重庆',salary:'',url:TRANSSION_URL,urls:[TRANSSION_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TRANSSION_TEXT,raw_text:TRANSSION_TEXT,status:'待筛选',tags:['AI/Agent'],notes:`招聘交流群：${TRANSSION_GROUP_URL}；具体岗位要求和招聘安排以职位页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TRANSSION_KEY, '1');
    save();
  }
  function addPendingSpdbChangsha() {
    if (localStorage.getItem(PENDING_SPDB_CHANGSHA_KEY)) return;
    const urls = [SPDB_CHANGSHA_URL, SPDB_CHANGSHA_WECHAT_URL];
    const job = makeJob({company:'浦发银行长沙分行',title:'2027年度校园招聘（业务储备生 / 科技储备岗）',city:'长沙等',salary:'',url:urls.join('\n'),urls,deadline:'10月8日18:00',linkParseStatus:'需人工打开',type:'校招',source:'微信公众号',raw:SPDB_CHANGSHA_TEXT,raw_text:SPDB_CHANGSHA_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2025、2026、2027届毕业生，不限专业；网申官网和公众号文章链接均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SPDB_CHANGSHA_KEY, '1');
    save();
  }
  function addPendingAerodynamics() {
    if (localStorage.getItem(PENDING_AERODYNAMICS_KEY)) return;
    const job = makeJob({company:'中国航天空气动力技术研究院',title:'待确认（微信文章）',city:'',salary:'',url:AERODYNAMICS_URL,urls:[AERODYNAMICS_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:AERODYNAMICS_TEXT,raw_text:AERODYNAMICS_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_AERODYNAMICS_KEY, '1');
    save();
  }
  function addPendingGuangqi() {
    if (localStorage.getItem(PENDING_GUANGQI_KEY)) return;
    const job = makeJob({company:'光启',title:'待确认（微信文章）',city:'',salary:'',url:GUANGQI_URL,urls:[GUANGQI_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:GUANGQI_TEXT,raw_text:GUANGQI_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_GUANGQI_KEY, '1');
    save();
  }
  function addPendingRonbay() {
    if (localStorage.getItem(PENDING_RONBAY_KEY)) return;
    const common = {city:'',salary:'',url:RONBAY_URL,urls:[RONBAY_URL],linkParseStatus:'已解析',type:'校招',source:'DOCX附件',raw:RONBAY_TEXT,raw_text:RONBAY_TEXT,status:'待筛选',notes:'招聘对象：2027届应届毕业生；文档未明确岗位工作地点和薪资；另有二维码投递及扫码进群说明。'};
    const roles = [
      ['研发类',[]],['生产制造类',[]],['营销供应类',[]],['工程类',[]],['智能类',['AI/Agent']],['AI专项',['AI/Agent']],['海外专项',[]],['管培生专项',[]]
    ];
    roles.forEach(([role,tags]) => {
      const job = makeJob({company:'宁波容百新能源科技股份有限公司',title:`2027 届全球校园招聘（${role}）`,tags,...common});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    });
    localStorage.setItem(PENDING_RONBAY_KEY, '1');
    save();
  }
  function addPendingSgs() {
    if (localStorage.getItem(PENDING_SGS_KEY)) return;
    const job = makeJob({company:'SGS',title:'待确认（微信文章）',city:'',salary:'',url:SGS_URL,urls:[SGS_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:SGS_TEXT,raw_text:SGS_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SGS_KEY, '1');
    save();
  }
  function addPendingCiic() {
    if (localStorage.getItem(PENDING_CIIC_KEY)) return;
    const job = makeJob({company:'中智',title:'待确认（微信文章）',city:'',salary:'',url:CIIC_URL,urls:[CIIC_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CIIC_TEXT,raw_text:CIIC_TEXT,status:'待筛选',notes:'目前仅收到企业名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CIIC_KEY, '1');
    save();
  }
  function addPendingWaterdrop() {
    if (localStorage.getItem(PENDING_WATERDROP_KEY)) return;
    const job = makeJob({company:'水滴公司',title:'校招岗位（待确认）',city:'',salary:'',url:WATERDROP_URL,urls:[WATERDROP_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:WATERDROP_TEXT,raw_text:WATERDROP_TEXT,status:'待筛选',notes:'内推码：AHHW53Y；原文未提供具体岗位名称、地点和方向。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_WATERDROP_KEY, '1');
    save();
  }
  function addPendingYotta() {
    if (localStorage.getItem(PENDING_YOTTA_KEY)) return;
    const job = makeJob({company:'友塔游戏',title:'2027 届秋季校园招聘（技术开发 / 产品策划 / 发行运营 / 艺术设计）',city:'上海',salary:'有竞争力的薪资；年度2次调薪；餐补、房补等福利',url:YOTTA_URL,urls:[YOTTA_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:YOTTA_TEXT,raw_text:YOTTA_TEXT,status:'待筛选',notes:'产品策划含策划管培生、技术策划管培生、项目管理管培生；发行运营含市场管培生、运营管培生。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_YOTTA_KEY, '1');
    save();
  }
  function addPendingOppo() {
    if (localStorage.getItem(PENDING_OPPO_KEY)) return;
    const job = makeJob({company:'OPPO',title:'2027 届校园招聘（产品 / AI算法 / 软件 / 硬件 / 设计等）',city:'东莞、深圳、成都、上海、北京、西安、南京、重庆、武汉、海外',salary:'极具竞争力的薪资；定制化培养体系；多样化发展机制',url:OPPO_URL,urls:[OPPO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:OPPO_TEXT,raw_text:OPPO_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'内推码：X8335075；招聘岗位还包括工程技术、销售服务、品牌策划、采购、综合职能等方向。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_OPPO_KEY, '1');
    save();
  }
  function addPendingFanruan() {
    if (localStorage.getItem(PENDING_FANRUAN_KEY)) return;
    const job = makeJob({company:'帆软',title:'2027 届校园招聘（研发 / 产品 / 设计 / 销售 / 职能）',city:'南京、杭州等全国20+城市',salary:'一线城市待遇（具体薪资待查看岗位）',url:FANRUAN_URL,urls:[FANRUAN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:FANRUAN_TEXT,raw_text:FANRUAN_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'AI+BI方向；2027届本科及以上；简历直达HR。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_FANRUAN_KEY, '1');
    save();
  }
  function addPendingChinaNorinco() {
    if (localStorage.getItem(PENDING_CHINA_NORINCO_KEY)) return;
    const job = makeJob({company:'中国兵器',title:'待确认（微信文章）',city:'',salary:'',url:CHINA_NORINCO_URL,urls:[CHINA_NORINCO_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CHINA_NORINCO_TEXT,raw_text:CHINA_NORINCO_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型等信息请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CHINA_NORINCO_KEY, '1');
    save();
  }
  function addPendingRuankong() {
    if (localStorage.getItem(PENDING_RUANKONG_KEY)) return;
    const job = makeJob({company:'软控股份',title:'2027 届秋季全球校园招聘（机械设计 / 电气PLC / 软件算法等）',city:'青岛',salary:'本科10.5-13W；硕士13-17W；未来之星计划本科13-15.5W、硕士14.5-18W',url:RUANKONG_URL,urls:[RUANKONG_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:RUANKONG_TEXT,raw_text:RUANKONG_TEXT,status:'待筛选',notes:'网申原文为 ruankong2027.zhaopin.com，已规范为 https://ruankong2027.zhaopin.com；未来之星计划开放机械设计及PLC开发岗位；校招负责人：姜老师17854274335（微信同号）。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_RUANKONG_KEY, '1');
    save();
  }
  function mergeRuankongUpdate() {
    if (localStorage.getItem(PENDING_RUANKONG_UPDATE_KEY)) return;
    let job = state.jobs.find(j => normalize(j.company).includes('软控股份') || getUrls(j).some(url => url.includes('ruankong2027.zhaopin.com')));
    if (!job) {
      job = makeJob({company:'软控股份',title:'待确认（微信文章）',city:'',salary:'',url:RUANKONG_WECHAT_URL,urls:[RUANKONG_WECHAT_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:RUANKONG_UPDATE_TEXT,raw_text:RUANKONG_UPDATE_TEXT,status:'待筛选',notes:'目前仅收到软控股份名称和微信公众号文章链接，岗位详情请人工打开文章后补充。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    } else {
      const urls = getUrls(job);
      if (!urls.includes(RUANKONG_WECHAT_URL)) urls.push(RUANKONG_WECHAT_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充招聘消息 ---\n${RUANKONG_UPDATE_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}已补充软控股份微信公众号文章链接。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_RUANKONG_UPDATE_KEY, '1');
    save();
  }
  function addPendingSuzhouXuchuang() {
    if (localStorage.getItem(PENDING_SUZHOU_XUCHUANG_KEY)) return;
    const job = makeJob({company:'苏州旭创科技',title:'2027 届秋招正式批（研发 / 智能制造 / 职能）',city:'苏州、成都、铜陵、淮安、上海、北京及海外',salary:'',url:SUZHOU_XUCHUANG_URL,urls:[SUZHOU_XUCHUANG_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SUZHOU_XUCHUANG_TEXT,raw_text:SUZHOU_XUCHUANG_TEXT,status:'待筛选',notes:'2027届本科、硕士及博士毕业生；中际旭创旗下高速光互连解决方案企业；原文提示可添加微信回复“苏州旭创科技”获取投递链接，本工具不自动添加微信。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SUZHOU_XUCHUANG_KEY, '1');
    save();
  }
  function addPendingHesai() {
    if (localStorage.getItem(PENDING_HESAI_KEY)) return;
    const job = makeJob({company:'禾赛科技',title:'2027 届秋招（系统 / 器件 / 算法 / 软件 / 硬件 / 芯片 / AI等）',city:'上海、杭州、重庆',salary:'行业TOP级薪资；奖金股票',url:HESAI_URL,urls:[HESAI_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HESAI_TEXT,raw_text:HESAI_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'内推码：EQXUXBJ；选择“大使推荐”；岗位还包括光机、工艺、机械、产品、采购、销售等方向。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HESAI_KEY, '1');
    save();
  }
  function addPendingHirain() {
    if (localStorage.getItem(PENDING_HIRAIN_KEY)) return;
    const job = makeJob({company:'北京经纬恒润科技股份有限公司（HiRain）',title:'2027 届校园招聘（研发 / 生产 / 营销 / 管理）',city:'待确认',salary:'',url:HIRAIN_URL,urls:[],linkParseStatus:'需人工打开',type:'校招',source:'图片/海报',raw:HIRAIN_TEXT,raw_text:HIRAIN_TEXT,status:'待筛选',notes:'截至2026年8月，海报称有116名北京科技大学校友在职；含秋招绿色通道、季度/实时反馈、实习实践基地共建等校企合作信息；海报二维码为问卷入口，未提供可复制的投递 URL。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HIRAIN_KEY, '1');
    save();
  }
  function addPendingSilan() {
    if (localStorage.getItem(PENDING_SILAN_KEY)) return;
    const job = makeJob({company:'芯联集成',title:'2027 届校园招聘（研发 / 市场销售 / 工程技术 / 质量 / 职能运营）',city:'浙江绍兴、上海张江/临港',salary:'有竞争力的薪酬',url:SILAN_URL,urls:[SILAN_URL],linkParseStatus:'需人工打开',type:'校招',source:'QQ/微信群',raw:SILAN_TEXT,raw_text:SILAN_TEXT,status:'待筛选',notes:'本科及以上理工科相关专业；原文提示点击微信公众号推文获取投递二维码，暂未提供可复制的直接投递链接。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SILAN_KEY, '1');
    save();
  }
  function addPendingZhongweiSemicon() {
    if (localStorage.getItem(PENDING_ZHONGWEI_SEMICON_KEY)) return;
    const urls = [ZHONGWEI_SEMICON_URL, ZHONGWEI_GROUP_URL];
    const job = makeJob({company:'中微半导体',title:'27 届秋招正式批（设备研发 / 公共工程研发 / 售后服务 / 智能制造 / 职能支持）',city:'上海、南昌、成都、广州、武汉、合肥、北京、深圳、厦门、泉州等',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ZHONGWEI_SEMICON_TEXT,raw_text:ZHONGWEI_SEMICON_TEXT,status:'待筛选',notes:'2027届高校毕业生；投递页使用通用短链接，已与其他公司记录中的相同短链接按公司和岗位区分；原文提示可添加微信获取投递链接，本工具不自动添加微信。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ZHONGWEI_SEMICON_KEY, '1');
    save();
  }
  function addPendingCeecTech() {
    if (localStorage.getItem(PENDING_CEEC_TECH_KEY)) return;
    const job = makeJob({company:'中国能源建设集团科技发展有限公司',title:'2027 届校园招聘（工程师 / 调试工程师）',city:'',salary:'',url:CEEC_TECH_URL,urls:[CEEC_TECH_URL],linkParseStatus:'已解析',type:'校招',source:'DOCX附件',raw:CEEC_TECH_TEXT,raw_text:CEEC_TECH_TEXT,status:'待筛选',notes:'国有企业；招聘对象为2027届应届毕业生；专业需求包括能源动力、电气、继电保护、高电压技术、热能动力、机械设计制造及自动化、自动化、测控技术与仪器、环境工程、应用化学等；简章未明确具体工作城市和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CEEC_TECH_KEY, '1');
    save();
  }
  function addPendingHeibaidiao() {
    if (localStorage.getItem(PENDING_HEIBAIDIAO_KEY)) return;
    const job = makeJob({company:'黑白调｜傲风',title:'2027 届全球校园招聘（产品研发 / 供应链 / 设计 / 运营销售 / 市场品牌 / 专业类）',city:'杭州、深圳',salary:'',url:HEIBAIDIAO_URL,urls:[HEIBAIDIAO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HEIBAIDIAO_TEXT,raw_text:HEIBAIDIAO_TEXT,status:'待筛选',notes:'2027届海内外应届毕业生；投递后需在48小时内完成约10分钟测评，完成测评后才可进入面试流程；招满即止，建议尽早投递。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HEIBAIDIAO_KEY, '1');
    save();
  }
  function mergeHeibaidiaoUpdate() {
    if (localStorage.getItem(PENDING_HEIBAIDIAO_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('黑白调') || normalize(j.company).includes('傲风') || getUrls(j).some(url => url.includes('heibaidiao/54126')));
    if (!job) {
      const urls = [HEIBAIDIAO_UPDATED_URL, HEIBAIDIAO_GROUP_URL];
      const newJob = makeJob({company:'傲风（AutoFull）',title:'2027 届校园招聘（产品 / 设计 / 电商运营 / 市场营销 / 供应链 / 职能）',city:'杭州、上海、深圳、广州、东莞',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HEIBAIDIAO_UPDATED_TEXT,raw_text:HEIBAIDIAO_UPDATED_TEXT,status:'待筛选',notes:'招聘对象：2026年9月-2027年8月毕业的国内外应届生，本硕博均可；部分岗位支持弹性办公。'});
      if (!isDuplicate(newJob)) state.jobs.unshift(newJob);
    } else {
      const urls = getUrls(job);
      [HEIBAIDIAO_UPDATED_URL, HEIBAIDIAO_GROUP_URL].forEach(url => { if (!urls.includes(url)) urls.push(url); });
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '黑白调｜傲风';
      job.title = '2027 届校园招聘（产品 / 设计 / 电商运营 / 市场营销 / 供应链 / 职能）';
      job.city = '杭州、上海、深圳、广州、东莞';
      job.type = '校招';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充招聘消息 ---\n${HEIBAIDIAO_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充傲风详细岗位、流程、福利和答疑群；2026.09-2027.08毕业生可投。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_HEIBAIDIAO_UPDATE_KEY, '1');
    save();
  }
  function addPendingBjrcb() {
    if (localStorage.getItem(PENDING_BJRCB_KEY)) return;
    const job = makeJob({company:'北京农商银行',title:'待确认（微信文章）',city:'',salary:'',url:BJRCB_URL,urls:[BJRCB_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:BJRCB_TEXT,raw_text:BJRCB_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BJRCB_KEY, '1');
    save();
  }
  function addPendingHuijuJingcheng() {
    if (localStorage.getItem(PENDING_HUIJU_JINGCHENG_KEY)) return;
    const job = makeJob({company:'慧聚京诚',title:'待确认（微信文章）',city:'',salary:'',url:HUIJU_JINGCHENG_URL,urls:[HUIJU_JINGCHENG_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:HUIJU_JINGCHENG_TEXT,raw_text:HUIJU_JINGCHENG_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HUIJU_JINGCHENG_KEY, '1');
    save();
  }
  function addPendingBaic() {
    if (localStorage.getItem(PENDING_BAIC_KEY)) return;
    const job = makeJob({company:'北汽集团',title:'待确认（微信文章）',city:'',salary:'',url:BAIC_URL,urls:[BAIC_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:BAIC_TEXT,raw_text:BAIC_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BAIC_KEY, '1');
    save();
  }
  function addPendingCrrcZhuzhou() {
    if (localStorage.getItem(PENDING_CRRC_ZHUZHOU_KEY)) return;
    const job = makeJob({company:'中车株洲所',title:'待确认（微信文章）',city:'',salary:'',url:CRRC_ZHUZHOU_URL,urls:[CRRC_ZHUZHOU_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CRRC_ZHUZHOU_TEXT,raw_text:CRRC_ZHUZHOU_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CRRC_ZHUZHOU_KEY, '1');
    save();
  }
  function addPendingYealink() {
    if (localStorage.getItem(PENDING_YEALINK_KEY)) return;
    const job = makeJob({company:'亿联网络',title:'2027 届校园招聘（研发 / 营销 / 产品）',city:'',salary:'',url:YEALINK_URL,urls:[YEALINK_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:YEALINK_TEXT,raw_text:YEALINK_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'专属推荐码：ESKJAB；业务包含云+端AI音视频会议、IP语音通信及协作解决方案；原文未明确具体工作地点和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_YEALINK_KEY, '1');
    save();
  }
  function addPendingIntco() {
    if (localStorage.getItem(PENDING_INTCO_KEY)) return;
    const job = makeJob({company:'英科医疗',title:'2027 届校园招聘（研发 / IT / 营销 / 生产 / 职能）',city:'淄博、潍坊、济南、青岛、镇江、淮北、安庆、九江、北京、上海、海外',salary:'15-30W（具体根据岗位而定）',url:INTCO_URL,urls:[INTCO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:INTCO_TEXT,raw_text:INTCO_TEXT,status:'待筛选',notes:'医疗器械耗材高科技制造企业；福利包括五险一金、创新奖励、星级宿舍、自助餐厅；原文岗位“生成”按语境整理为“生产”，原文已完整保存。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_INTCO_KEY, '1');
    save();
  }
  function mergeIntcoUpdate() {
    if (localStorage.getItem(PENDING_INTCO_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('英科医疗') || getUrls(j).some(url => url.includes('global-intco.jobs.feishu.cn')));
    if (job) {
      job.company = '英科医疗';
      job.title = '2027 届校园招聘（研发 / IT / 营销 / 生产 / 职能）';
      job.city = '北京、济南、淄博、潍坊、青岛、上海、江苏、江西、安徽、海外';
      job.salary = '英科young计划15W-30W；英才计划25W-45W';
      job.type = '校招';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 宣讲会补充信息 ---\n${INTCO_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充宣讲会：2026-09-18 17:30，招生就业多功能厅；现场收简历并直接初试，复试和Offer流程较快；薪资计划及工作地点已补充。`;
      job.updatedAt = Date.now();
    } else {
      const job = makeJob({company:'英科医疗',title:'2027 届校园招聘（研发 / IT / 营销 / 生产 / 职能）',city:'北京、济南、淄博、潍坊、青岛、上海、江苏、江西、安徽、海外',salary:'英科young计划15W-30W；英才计划25W-45W',url:INTCO_URL,urls:[INTCO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:INTCO_UPDATED_TEXT,raw_text:INTCO_UPDATED_TEXT,status:'待筛选',notes:'宣讲时间：2026-09-18 17:30；地点：招生就业多功能厅；现场收简历并直接初试。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    }
    localStorage.setItem(PENDING_INTCO_UPDATE_KEY, '1');
    save();
  }
  function addPendingIntcoPoster() {
    if (localStorage.getItem(PENDING_INTCO_POSTER_KEY)) return;
    const intco = state.jobs.find(j => normalize(j.company).includes('英科医疗'));
    if (intco) {
      intco.raw = `${intco.raw || intco.raw_text || ''}\n\n--- 英科医疗·英科再生海报补充 ---\n${INTCO_POSTER_TEXT}`;
      intco.raw_text = intco.raw;
      intco.notes = `${intco.notes ? intco.notes + '；' : ''}已补充英科医疗·英科再生英才计划海报信息；海报二维码投递入口未转换为 URL。`;
      intco.updatedAt = Date.now();
    }
    const regeneration = makeJob({company:'英科再生',title:'英才计划 2027 届校园招聘（软件研发 / 机械研发 / 职能 / AI等）',city:'待从海报二维码进入岗位页面确认',salary:'软件研发类25-55W；机械研发类25-55W；职能类25-40W',url:'',urls:[],linkParseStatus:'待解析',type:'校招',source:'图片/海报',raw:INTCO_POSTER_TEXT,raw_text:INTCO_POSTER_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'海报含英科再生投递二维码；具体工作地点、岗位要求和投递 URL 待扫码确认。'});
    if (!isDuplicate(regeneration)) state.jobs.unshift(regeneration);
    localStorage.setItem(PENDING_INTCO_POSTER_KEY, '1');
    save();
  }
  function addPendingSany() {
    if (localStorage.getItem(PENDING_SANY_KEY)) return;
    const job = makeJob({company:'三一集团',title:'2027 届全球校园招聘（研发技术 / 计算机AI / 生产制造 / 营销服务 / 采购 / 财务 / 管理）',city:'长沙、上海、北京、广州、昆山、沈阳、珠海、成都、西安等国内城市及海外',salary:'行业竞争力薪酬激励',url:SANY_URL,urls:[SANY_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SANY_TEXT,raw_text:SANY_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'内推码：ESKM1A；含计算机及AI类岗位、领军管培专项培养和海外岗位。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SANY_KEY, '1');
    save();
  }
  function addPendingStics() {
    if (localStorage.getItem(PENDING_STICS_KEY)) return;
    const urls = [STICS_FORM_URL, STICS_URL];
    const job = makeJob({company:'中景芯创',title:'27 届校园招聘专场宣讲会（技术研发 / 工艺制造 / 质量可靠性 / 数字化IT / 职能）',city:'',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:STICS_TEXT,raw_text:STICS_TEXT,status:'待筛选',notes:'宣讲时间：9月9日19:00-21:00；场地：逸夫楼401；宣讲会报名可优先面试；原文未明确具体工作城市和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_STICS_KEY, '1');
    save();
  }
  function addPendingAntGroup() {
    if (localStorage.getItem(PENDING_ANT_GROUP_KEY)) return;
    const job = makeJob({company:'蚂蚁集团',title:'2027 届秋季校园招聘（技术 / 产品 / 运营 / 数据 / 风险管理）',city:'',salary:'',url:ANT_GROUP_URL,urls:[ANT_GROUP_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ANT_GROUP_TEXT,raw_text:ANT_GROUP_TEXT,status:'待筛选',notes:'北京科技大学专属投递通道；招聘对象为毕业时间2026年11月-2027年10月的2027届海内外院校毕业生；原文未明确具体工作地点和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ANT_GROUP_KEY, '1');
    save();
  }
  function addPendingXinhecheng() {
    if (localStorage.getItem(PENDING_XINHECHENG_KEY)) return;
    const urls = [XINHECHENG_FAIR_URL, XINHECHENG_URL];
    const job = makeJob({company:'山东新和成控股有限公司',title:'2027 届校园招聘现场宣讲（研发 / 化工 / 材料 / 生物 / 自动化 / 机械等）',city:'',salary:'本科13-15W；硕士16.5-20+W；博士一人一议',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:XINHECHENG_TEXT,raw_text:XINHECHENG_TEXT,status:'待筛选',notes:'宣讲时间：2026-09-09 19:00；地点：机电信息楼616；原文企业简介主体为浙江新和成股份有限公司；具体工作城市未明确。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_XINHECHENG_KEY, '1');
    save();
  }
  function addPendingBeizi() {
    if (localStorage.getItem(PENDING_BEIZI_KEY)) return;
    const job = makeJob({company:'北自科技',title:'待确认（微信文章）',city:'',salary:'',url:BEIZI_URL,urls:[BEIZI_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:BEIZI_TEXT,raw_text:BEIZI_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BEIZI_KEY, '1');
    save();
  }
  function addPendingTianSun() {
    if (localStorage.getItem(PENDING_TIAN_SUN_KEY)) return;
    const job = makeJob({company:'天隼实验室',title:'2027 届校园招聘宣讲会（博士 / 硕士，信息通信 / 计算机 / 控制等）',city:'北京（宣讲会）；实际工作地点待确认',salary:'博士35W起；硕士20W起；优秀人才一事一议',url:TIAN_SUN_URL,urls:[TIAN_SUN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TIAN_SUN_TEXT,raw_text:TIAN_SUN_TEXT,status:'待筛选',notes:'湖南省政府直属事业单位和新型研发机构；宣讲时间：2026-09-10 19:00；地点：中国科学院大学中关村校区N306；福利包含人才公寓、生活补贴及长沙市购房补贴。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TIAN_SUN_KEY, '1');
    save();
  }
  function addPendingCsic716() {
    if (localStorage.getItem(PENDING_CSIC_716_KEY)) return;
    const job = makeJob({company:'中船七一六所',title:'待确认（微信文章）',city:'',salary:'',url:CSIC_716_URL,urls:[CSIC_716_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CSIC_716_TEXT,raw_text:CSIC_716_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CSIC_716_KEY, '1');
    save();
  }
  function addPendingRuijie() {
    if (localStorage.getItem(PENDING_RUIJIE_KEY)) return;
    const job = makeJob({company:'锐捷网络',title:'2027 届校园招聘（产品 / 研发 / 设计 / 管培 / 市场 / 职能 / 技服）',city:'福州、北京、成都、南京、上海、深圳、海外',salary:'',url:RUIJIE_URL,urls:[RUIJIE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:RUIJIE_TEXT,raw_text:RUIJIE_TEXT,status:'待筛选',notes:'国有控股、深交所创业板上市（301165）；原文未明确薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_RUIJIE_KEY, '1');
    save();
  }
  function addPendingFamsun() {
    if (localStorage.getItem(PENDING_FAMSUN_KEY)) return;
    const urls = [FAMSUN_URL, FAMSUN_GROUP_URL];
    const job = makeJob({company:'丰尚',title:'2027 届校园招聘（研发 / 技术 / 项目 / 营销 / 职能）',city:'扬州、深圳、美国、德国等',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:FAMSUN_TEXT,raw_text:FAMSUN_TEXT,status:'待筛选',notes:'500+校招岗位；本硕博均可投；覆盖机械、计算机、食品、电气、土木、财会、外语、生物、化工等专业。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_FAMSUN_KEY, '1');
    save();
  }
  function addPendingIwhalecloud() {
    if (localStorage.getItem(PENDING_IWHALECLOUD_KEY)) return;
    const urls = [IWHALECLOUD_URL, IWHALECLOUD_QA_URL];
    const job = makeJob({company:'浩鲸科技',title:'2027 届秋季校园招聘（研发 / 数据算法 / 综合技术 / 市场营销 / 职能支持）',city:'南京、广州、长沙、福州、厦门、西安',salary:'核心研发12-20万；数据算法18-30万；综合技术10-22万；市场营销20-30万；职能支持8-12万',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:IWHALECLOUD_TEXT,raw_text:IWHALECLOUD_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'内推码：EVV8SH；重点方向包含大模型、AI应用、NLP、图像、语音、VLA、导航控制、强化学习、推理加速等。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_IWHALECLOUD_KEY, '1');
    save();
  }
  function addPendingCnnc404() {
    if (localStorage.getItem(PENDING_CNNC_404_KEY)) return;
    const job = makeJob({company:'中核四〇四',title:'待确认（微信文章）',city:'',salary:'',url:CNNC_404_URL,urls:[CNNC_404_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:CNNC_404_TEXT,raw_text:CNNC_404_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CNNC_404_KEY, '1');
    save();
  }
  function addPendingCoge() {
    if (localStorage.getItem(PENDING_COGE_KEY)) return;
    const job = makeJob({company:'科捷智能',title:'2027 届校园大使招聘',city:'',salary:'国内985/211：简历通过5元/人、接受offer 200元/人、签三方1000元/人；海外院校接受offer 500元/人',url:COGE_URL,urls:[],linkParseStatus:'待解析',type:'其他',source:'QQ/微信群',raw:COGE_TEXT,raw_text:COGE_TEXT,status:'待筛选',notes:'项目类型为校园大使招募；全日制本科在校生，大二/大三/研一/研二优先；报名联系人：秦经理17367037375（微信）；原文未提供 URL。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_COGE_KEY, '1');
    save();
  }
  function addPendingBankOfChina() {
    if (localStorage.getItem(PENDING_BANK_OF_CHINA_KEY)) return;
    const job = makeJob({company:'中国银行',title:'待确认（微信文章）',city:'',salary:'',url:BANK_OF_CHINA_URL,urls:[BANK_OF_CHINA_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:BANK_OF_CHINA_TEXT,raw_text:BANK_OF_CHINA_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点、招聘类型及投递方式请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BANK_OF_CHINA_KEY, '1');
    save();
  }
  function addPendingBaichuanOrigin() {
    if (localStorage.getItem(PENDING_BAICHUAN_ORIGIN_KEY)) return;
    const job = makeJob({company:'百川智能',title:'源点顶尖人才计划（大模型算法 / AI Infra / Agent算法 / AI产品）',city:'北京',salary:'',url:BAICHUAN_ORIGIN_URL,urls:[BAICHUAN_ORIGIN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:BAICHUAN_ORIGIN_TEXT,raw_text:BAICHUAN_ORIGIN_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'应届岗位面向2025-2027年毕业生；实习岗位面向2027年毕业在校生；内推码：SMHWHPM；校招与实习均保留在同一条源点计划记录中。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BAICHUAN_ORIGIN_KEY, '1');
    save();
  }
  function addPendingPapegames() {
    if (localStorage.getItem(PENDING_PAPEGAMES_KEY)) return;
    const job = makeJob({company:'叠纸游戏',title:'2027 届秋季校园招聘（技术研发 / 策划 / 美术 / 动画 / 市场运营 / 职能 / 音频）',city:'',salary:'',url:PAPEGAMES_URL,urls:[PAPEGAMES_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:PAPEGAMES_TEXT,raw_text:PAPEGAMES_TEXT,status:'待筛选',notes:'应聘流程：网申→笔试→面试→Offer；原文未明确工作地点和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_PAPEGAMES_KEY, '1');
    save();
  }
  function mergeBokeUpdate() {
    if (localStorage.getItem(PENDING_BOKE_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('波克') || getUrls(j).some(url => url.includes('boke.jobs.feishu.cn')));
    if (!job) {
      const newJob = makeJob({company:'波克',title:'2027 届秋季校园招聘（技术 / 美术 / 产品 / 发行 / 职能）',city:'上海市普陀区',salary:'行业竞争力薪酬；免费三餐；租房补贴；年度带薪旅游等',url:BOKE_UPDATED_URL,urls:[BOKE_UPDATED_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:BOKE_UPDATED_TEXT,raw_text:BOKE_UPDATED_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'研发和技术人员占比60%以上；AI全线赋能；岗位包括算法、开发、AI产品经理等。'});
      if (!isDuplicate(newJob)) state.jobs.unshift(newJob);
    } else {
      const urls = getUrls(job);
      if (!urls.includes(BOKE_UPDATED_URL)) urls.push(BOKE_UPDATED_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '波克';
      job.title = '2027 届秋季校园招聘（技术 / 美术 / 产品 / 发行 / 职能）';
      job.city = '上海市普陀区';
      job.type = '校招';
      job.tags = Array.from(new Set([...(job.tags || []), 'AI/Agent']));
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 补充招聘消息 ---\n${BOKE_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充信息：研发和技术人员占比60%以上，AI全线赋能；新增AI产品经理等岗位方向。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_BOKE_UPDATE_KEY, '1');
    save();
  }
  function addPendingShein() {
    if (localStorage.getItem(PENDING_SHEIN_KEY)) return;
    const job = makeJob({company:'SHEIN希音',title:'27 届秋季校园招聘（信息技术 / 商品平台 / 服装供应链 / 国际物流 / 职能 / 全球运营）',city:'',salary:'',url:SHEIN_URL,urls:[SHEIN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SHEIN_TEXT,raw_text:SHEIN_TEXT,status:'待筛选',notes:'招聘对象：2027届海内外应届毕业生；原文未明确具体工作地点和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SHEIN_KEY, '1');
    save();
  }
  function addPendingTuhu() {
    if (localStorage.getItem(PENDING_TUHU_KEY)) return;
    const job = makeJob({company:'途虎养车',title:'校招岗位（算法 / 全栈开发 / 产品 / 运营 / 硬件）',city:'上海、武汉',salary:'',url:TUHU_URL,urls:[TUHU_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TUHU_TEXT,raw_text:TUHU_TEXT,status:'待筛选',notes:'中国领先的线上线下一体化汽车服务平台；原文未明确招聘届次和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TUHU_KEY, '1');
    save();
  }
  function addPendingRelianceMetals() {
    if (localStorage.getItem(PENDING_RELIANCE_METALS_KEY)) return;
    const job = makeJob({company:'热联集团',title:'2027 届校园招聘（大宗商品期货 / 商务 / 业务管培）',city:'杭州',salary:'',url:RELIANCE_METALS_URL,urls:[RELIANCE_METALS_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:RELIANCE_METALS_TEXT,raw_text:RELIANCE_METALS_TEXT,status:'待筛选',notes:'国有控股大宗商品产业服务商；招聘对象为2027届国内外高校本科生、硕士生；建议当天投递。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_RELIANCE_METALS_KEY, '1');
    save();
  }
  function addPendingCasic() {
    if (localStorage.getItem(PENDING_CASIC_KEY)) return;
    const job = makeJob({company:'中国航天科工',title:'2027 届校园招聘（航空宇航 / 电子信息 / 计算机 / 自动化 / 机械 / 材料 / 职能）',city:'北京、武汉、深圳、南京、呼和浩特等',salary:'',url:CASIC_URL,urls:[CASIC_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CASIC_TEXT,raw_text:CASIC_TEXT,status:'待筛选',notes:'中央骨干企业；招聘对象为2027届高校毕业生；建议当天投递。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CASIC_KEY, '1');
    save();
  }
  function addPendingFunplus() {
    if (localStorage.getItem(PENDING_FUNPLUS_KEY)) return;
    const job = makeJob({company:'FunPlus',title:'2027 届校招（技术 / 策划 / 美术 / 发行 / 运营 / 用研行研）',city:'北京、成都',salary:'',url:FUNPLUS_URL,urls:[FUNPLUS_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:FUNPLUS_TEXT,raw_text:FUNPLUS_TEXT,status:'待筛选',notes:'面向27届校招和28届实习；原文未明确薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_FUNPLUS_KEY, '1');
    save();
  }
  function addPendingUnisoc() {
    if (localStorage.getItem(PENDING_UNISOC_KEY)) return;
    const urls = [UNISOC_URL, UNISOC_GROUP_URL];
    const job = makeJob({company:'紫光展锐',title:'27 届秋招正式批（芯片 / 硬件 / 软件开发 / 算法 / 测试开发 / 产品 / 供应链）',city:'以具体岗位页面为准',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:UNISOC_TEXT,raw_text:UNISOC_TEXT,status:'待筛选',notes:'平台型芯片设计企业；招聘对象为2027届相关专业高校毕业生；投递页和交流群为通用链接，已按公司和岗位独立保存；原文提示可添加微信获取投递链接，本工具不自动添加微信。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_UNISOC_KEY, '1');
    save();
  }
  function addPendingEcovacs() {
    if (localStorage.getItem(PENDING_ECOVACS_KEY)) return;
    const job = makeJob({company:'科沃斯机器人股份有限公司',title:'校园招聘（产品工程师 / 工业工程师 / 算法工程师 / 品牌 / 电商运营 / 人事）',city:'深圳、苏州',salary:'',url:ECOVACS_URL,urls:[ECOVACS_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ECOVACS_TEXT,raw_text:ECOVACS_TEXT,status:'待筛选',notes:'招聘对象：2027届本硕博应届毕业生；猎聘投递时需在经验中选择“应届生”，建议注册后当天完成投递。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ECOVACS_KEY, '1');
    save();
  }
  function addPendingZhplus() {
    if (localStorage.getItem(PENDING_ZHPLUS_KEY)) return;
    const job = makeJob({company:'智加科技（满帮集团控股）',title:'2027 届校园招聘（算法 / 软件 / 系统集成 / 数据闭环 / 仿真测试）',city:'苏州、上海、北京',salary:'高薪回报；免费三餐、下午茶等福利',url:ZHPLUS_URL,urls:[ZHPLUS_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ZHPLUS_TEXT,raw_text:ZHPLUS_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'满帮集团控股子公司；26-27届本硕博可投；推荐码未提供。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ZHPLUS_KEY, '1');
    save();
  }
  function addPendingKe() {
    if (localStorage.getItem(PENDING_KE_KEY)) return;
    const job = makeJob({company:'贝壳',title:'2027 届 ADC 校招+定向实习（研发 / 算法 / 产品 / 运营 / 业务 / 职能）',city:'',salary:'',url:KE_URL,urls:[KE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:KE_TEXT,raw_text:KE_TEXT,status:'待筛选',notes:'学校专属推荐码：EZ9GTB；校招+定向实习双通道；27届同学可投，每人限投1岗；实习优秀可转正。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_KE_KEY, '1');
    save();
  }
  function addPendingAerospace208() {
    if (localStorage.getItem(PENDING_AEROSPACE208_KEY)) return;
    const job = makeJob({company:'航天208所',title:'待确认（微信文章）',city:'',salary:'',url:AEROSPACE208_URL,urls:[AEROSPACE208_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:AEROSPACE208_TEXT,raw_text:AEROSPACE208_TEXT,status:'待筛选',notes:'目前仅收到单位名称和微信公众号文章链接，岗位、地点和招聘类型请人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_AEROSPACE208_KEY, '1');
    save();
  }
  function addPendingAftershokz() {
    if (localStorage.getItem(PENDING_AFTERSHOKZ_KEY)) return;
    const urls = [AFTERSHOKZ_URL, AFTERSHOKZ_QA_URL];
    const job = makeJob({company:'韶音科技',title:'2027 届校园招聘（研究 / 开发 / 产品 / 工程技术 / 品质 / IT / 营销运营等）',city:'深圳、香港、武汉',salary:'极具竞争力的薪资；租房补贴；校招生公寓；免费健身房等',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:AFTERSHOKZ_TEXT,raw_text:AFTERSHOKZ_TEXT,status:'待筛选',notes:'内推码：DSpVM7fP；100+岗位；内推简历优先筛选。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_AFTERSHOKZ_KEY, '1');
    save();
  }
  function addPendingTclIndustries() {
    if (localStorage.getItem(PENDING_TCL_INDUSTRIES_KEY)) return;
    const job = makeJob({company:'TCL实业',title:'2027 届校园招聘（研发技术 / 产品设计 / 市场营销 / 智能制造 / 供应链 / 财务金融 / 综合管理）',city:'',salary:'',url:TCL_INDUSTRIES_URL,urls:[TCL_INDUSTRIES_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TCL_INDUSTRIES_TEXT,raw_text:TCL_INDUSTRIES_TEXT,status:'待筛选',notes:'请用 PC 端打开；实业内推码：vzatho。原文未明确具体工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TCL_INDUSTRIES_KEY, '1');
    save();
  }
  function addPendingTclCsot() {
    if (localStorage.getItem(PENDING_TCL_CSOT_KEY)) return;
    const job = makeJob({company:'TCL华星光电',title:'2027 届校园招聘（半导体显示方向，岗位待查看）',city:'',salary:'',url:TCL_CSOT_URL,urls:[TCL_CSOT_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TCL_CSOT_TEXT,raw_text:TCL_CSOT_TEXT,status:'待筛选',notes:'华星内推码：uiqrxh；TCL实业和TCL华星光电为互相独立的招聘主体；原文未明确具体岗位和工作地点。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TCL_CSOT_KEY, '1');
    save();
  }
  function addPendingSept15Fairs() {
    if (localStorage.getItem(PENDING_SEPT15_FAIRS_KEY)) return;
    SEPT15_FAIR_ITEMS.forEach(item => {
      const findExisting = () => {
        if (item.merge === 'cctc') return state.jobs.find(j => normalize(j.company).includes('三环集团') || getUrls(j).some(url => url.includes('hr.cctc.cc')));
        if (item.merge === 'kehua-group') return state.jobs.find(j => normalize(j.company).includes('科华集团') && !normalize(j.company).includes('科华数据'));
        if (item.merge === 'smic') return state.jobs.find(j => normalize(j.company).includes('中芯国际') || getUrls(j).some(url => url.includes('smics')));
        if (item.merge === 'scc') return state.jobs.find(j => normalize(j.company).includes('深南电路') || getUrls(j).some(url => url.includes('scc.zhiye.com')));
        if (item.merge === 'new-oriental') return state.jobs.find(j => normalize(j.company).includes('新东方') || getUrls(j).some(url => url.includes('07SfRy')));
        return null;
      };
      const existing = findExisting();
      const urls = [item.url, item.extraUrl].filter(Boolean);
      const fairText = `${item.company}｜${item.title}\n时间：${item.time}\n地点：${item.venue}${item.levels ? `\n面向学生：${item.levels}` : ''}${item.extraUrl ? `\n宣讲会网址：${item.extraUrl}` : ''}\n详细信息：${item.url}`;
      if (existing) {
        const existingUrls = getUrls(existing);
        urls.forEach(url => { if (!existingUrls.includes(url)) existingUrls.push(url); });
        existing.urls = existingUrls;
        existing.url = existingUrls.join('\n');
        existing.title = item.title;
        if (!existing.city) existing.city = item.city;
        else if (!existing.city.includes(item.venue)) existing.city = `${existing.city}；宣讲：${item.venue}`;
        existing.type = '校招';
        existing.tags = Array.from(new Set([...(existing.tags || []), ...(item.tags || [])]));
        existing.raw = `${existing.raw || existing.raw_text || ''}\n\n--- 9.15 活动补充信息 ---\n${fairText}`;
        existing.raw_text = existing.raw;
        existing.notes = `${existing.notes ? existing.notes + '；' : ''}补充活动时间：${item.time}；地点：${item.venue}${item.levels ? `；面向${item.levels}` : ''}；详情链接已保留。`;
        existing.updatedAt = Date.now();
      } else {
        const job = makeJob({company:item.company,title:item.title,city:item.city,salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'校园招聘会',raw:fairText,raw_text:fairText,status:'待筛选',tags:item.tags || [],notes:`活动时间：${item.time}；地点：${item.venue}${item.levels ? `；面向${item.levels}` : ''}；具体岗位和工作地点请以详情链接为准。`});
        if (!isDuplicate(job) || item.merge === 'kehua-group') state.jobs.unshift(job);
      }
    });
    localStorage.setItem(PENDING_SEPT15_FAIRS_KEY, '1');
    save();
  }
  function addPendingSpaceT1() {
    if (localStorage.getItem(PENDING_SPACE_T1_KEY)) return;
    const urls = [SPACE_T1_URL, SPACE_T1_DOC_URL];
    const job = makeJob({company:'进迭时空',title:'2027 届校园招聘（AI CPU / 编译器 / CPU / SoC / 芯片 / 系统软件 / AI应用等）',city:'北京、杭州、上海、珠海、深圳',salary:'本科25-35W；硕士35-50W',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SPACE_T1_TEXT,raw_text:SPACE_T1_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'推荐码：NTA8TSe；立足RISC-V架构，专注AI CPU芯片；投递链接和招聘简章均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SPACE_T1_KEY, '1');
    save();
  }
  function addPendingEaspring() {
    if (localStorage.getItem(PENDING_EASPRING_KEY)) return;
    const job = makeJob({company:'当升科技',title:'2027 届校园招聘（研发 / 工艺质量 / 设备自动化 / 销售职能 / 生产现场 / 检测）',city:'北京（宣讲会）',salary:'工程师年薪15-35W',url:EASPRING_URL,urls:[EASPRING_URL],linkParseStatus:'需人工打开',type:'校招',source:'QQ/微信群',raw:EASPRING_TEXT,raw_text:EASPRING_TEXT,status:'待筛选',notes:'宣讲时间：2026-09-17 19:00；地点：逸夫楼601；本科、硕士、博士均可；现场抽取直通面试卡；微信公众号详情链接已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_EASPRING_KEY, '1');
    save();
  }
  function addPendingCnncZhongyuan() {
    if (localStorage.getItem(PENDING_CNNC_ZHONGYUAN_KEY)) return;
    const urls = [CNNC_ZHONGYUAN_ARTICLE_URL, CNNC_ZHONGYUAN_URL];
    const job = makeJob({company:'中国中原对外工程有限公司',title:'2027 届校园招聘（核工程 / 机械 / 电气 / 自动化 / 能源动力 / 土木 / 计算机等）',city:'北京、上海、海外',salary:'具有市场竞争力的薪酬和福利待遇',url:urls.join('\n'),urls,linkParseStatus:'需人工打开',type:'校招',source:'QQ/微信群',raw:CNNC_ZHONGYUAN_TEXT,raw_text:CNNC_ZHONGYUAN_TEXT,status:'待筛选',notes:'中核集团所属企业；微信详情链接和中核网申链接均已保留；专业覆盖核工程、机械、电气、自动化、材料、能源动力、土木、安全、俄语、计算机等。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CNNC_ZHONGYUAN_KEY, '1');
    save();
  }
  function addPending37Interview() {
    if (localStorage.getItem(PENDING_37_INTERVIEW_KEY)) return;
    const urls = [THIRTY_SEVEN_SIGNUP_URL, THIRTY_SEVEN_CAMPUS_URL];
    const job = makeJob({company:'三七互娱',title:'北京线下面试专场（游戏策划 / 海外运营 / 广告优化 / Unity客户端开发）',city:'北京',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:THIRTY_SEVEN_TEXT,raw_text:THIRTY_SEVEN_TEXT,status:'待筛选',notes:'面试时间：9月17日、9月18日；现场1V1面试，大部分岗位现场终面，最快当天发Offer；报名链接和网申入口均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_37_INTERVIEW_KEY, '1');
    save();
  }
  function mergeHoymileUpdate() {
    if (localStorage.getItem(PENDING_HOYMILE_UPDATE_KEY)) return;
    const job = state.jobs.find(j => normalize(j.company).includes('豪迈') || getUrls(j).some(url => url.includes('eLma5C8uOm3T42Fyh5ywuw')));
    if (job) {
      job.company = '豪迈集团';
      job.title = '2027 届秋季校园招聘（机械 / 电气 / 自动化 / 材料 / 化工 / 计算机等）';
      job.city = '潍坊高密、莒县、坊子、山东青岛、威海、日照、江苏启东等';
      job.salary = '本科15-17W；硕士18-25W';
      job.type = '校招';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 招聘海报补充信息 ---\n${HOYMILE_UPDATED_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充宣讲会：9月18日19:00，逸夫楼206；海报二维码用于获取更多信息和投递简历，暂无可复制 URL。`;
      job.updatedAt = Date.now();
    } else {
      const job = makeJob({company:'豪迈集团',title:'2027 届秋季校园招聘（机械 / 电气 / 自动化 / 材料 / 化工 / 计算机等）',city:'潍坊高密、莒县、坊子、山东青岛、威海、日照、江苏启东等',salary:'本科15-17W；硕士18-25W',url:'',urls:[],linkParseStatus:'待解析',type:'校招',source:'图片/海报',raw:HOYMILE_UPDATED_TEXT,raw_text:HOYMILE_UPDATED_TEXT,status:'待筛选',notes:'宣讲时间：9月18日19:00；地点：逸夫楼206；海报二维码投递，待人工扫码补充链接。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    }
    localStorage.setItem(PENDING_HOYMILE_UPDATE_KEY, '1');
    save();
  }
  function addPendingGeely() {
    if (localStorage.getItem(PENDING_GEELY_KEY)) return;
    const urls = [GEELY_URL, GEELY_GROUP_URL];
    const job = makeJob({company:'浙江吉利控股集团有限公司',title:'2027 届秋季校园招聘（法律 / 动力研发项目管理 / 质量 / 管培 / 新能源标定等）',city:'杭州、宁波、无锡、衢州',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:GEELY_TEXT,raw_text:GEELY_TEXT,status:'待筛选',notes:'招聘对象：2027届应届毕业生；投递链接和27届招聘交流群均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_GEELY_KEY, '1');
    save();
  }
  function addPendingPinganPension() {
    if (localStorage.getItem(PENDING_PINGAN_PENSION_KEY)) return;
    const urls = [PINGAN_PENSION_URL, PINGAN_PENSION_GROUP_URL];
    const job = makeJob({company:'平安养老保险股份有限公司',title:'2027 届秋季校园招聘（年金业务管培 / AI算法 / 固收交易 / 投资核算 / 系统开发 / 固收研究）',city:'北京、上海、广州、深圳、成都等',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:PINGAN_PENSION_TEXT,raw_text:PINGAN_PENSION_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2027届应届毕业生；投递链接和27届校招交流群均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_PINGAN_PENSION_KEY, '1');
    save();
  }
  function addPendingPinganBank() {
    if (localStorage.getItem(PENDING_PINGAN_BANK_KEY)) return;
    const urls = [PINGAN_BANK_URL, PINGAN_BANK_GROUP_URL];
    const job = makeJob({company:'平安银行',title:'27 届秋季校园招聘正式批',city:'',salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:PINGAN_BANK_TEXT,raw_text:PINGAN_BANK_TEXT,status:'待筛选',notes:'招聘对象：2027届毕业生；投递短链接为通用跳转链接，已按公司区分保存；交流群需在微信或企业微信中打开。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_PINGAN_BANK_KEY, '1');
    save();
  }
  function addPendingCrrcGroup() {
    if (localStorage.getItem(PENDING_CRRC_GROUP_KEY)) return;
    const job = makeJob({company:'中国中车集团',title:'2027 全球校园招聘北京城市专场',city:'北京海淀区',salary:'',url:CRRC_GROUP_URL,urls:[CRRC_GROUP_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CRRC_GROUP_TEXT,raw_text:CRRC_GROUP_TEXT,status:'待筛选',notes:'时间：9月19日14:00；地址：北京市海淀区东升科技园北街6号院8号楼院内；40多家分、子公司现场招聘；北京1群821388838、北京2群1070681478、北京3群1065115793。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CRRC_GROUP_KEY, '1');
    save();
  }
  function addPendingHaiyiSoftware() {
    if (localStorage.getItem(PENDING_HAIYI_SOFTWARE_KEY)) return;
    const job = makeJob({company:'海颐软件',title:'2027 届校园招聘（AI算法 / 电力能源咨询 / 嵌入式 / AI应用全栈 / 全栈开发）',city:'北京、南京、广州、烟台、济南、武汉、上海、西安、澳门、深圳、昆明等',salary:'',url:HAIYI_SOFTWARE_URL,urls:[HAIYI_SOFTWARE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HAIYI_SOFTWARE_TEXT,raw_text:HAIYI_SOFTWARE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'2027届本硕博应届生可投；实习生岗位同步开放，2028届可关注；投递链接已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HAIYI_SOFTWARE_KEY, '1');
    save();
  }
  function addPendingFotile() {
    if (localStorage.getItem(PENDING_FOTILE_KEY)) return;
    const urls = [FOTILE_URL, FOTILE_GROUP_URL, FOTILE_COLLECTION_URL];
    const job = makeJob({company:'方太集团',title:'27 届秋季校园招聘（具身智能 / 大模型 / 图像识别 / 研发 / 智能制造 / 营销等）',city:'宁波慈溪杭州湾',salary:'七险一金；14-16薪；年调薪幅度12-16%；实习工资全额发放',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:FOTILE_TEXT,raw_text:FOTILE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'员工内推码：E113515；工作时间855不加班；内推链接、秋招交流群和校招信息集合链接均已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_FOTILE_KEY, '1');
    save();
  }
  function addPendingHonggong() {
    if (localStorage.getItem(PENDING_HONGGONG_KEY)) return;
    const urls = [HONGGONG_URL, HONGGONG_QA_URL];
    const job = makeJob({company:'宏工科技',title:'27 届校园招聘（研发技术 / 供应交付 / 市场战略 / 职能运营）',city:'长沙、株洲、无锡',salary:'本科11-16万；硕士16-25万；博士一人一议',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:HONGGONG_TEXT,raw_text:HONGGONG_TEXT,status:'待筛选',notes:'内推码：qrkqgs；投递链接、招聘答疑文档均已保留；供应交付和市场战略岗位专业不限。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HONGGONG_KEY, '1');
    save();
  }
  function addPendingGoodwe() {
    if (localStorage.getItem(PENDING_GOODWE_KEY)) return;
    const job = makeJob({company:'固德威',title:'27 届秋季校园招聘（研发 / 职能 / 营销 / 技术服务 / 制造技术）',city:'苏州、武汉、深圳、安徽广德、佛山顺德',salary:'',url:GOODWE_URL,urls:[GOODWE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:GOODWE_TEXT,raw_text:GOODWE_TEXT,status:'待筛选',notes:'内推码：ymezfz；全球逆变器Top10；内推链接已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_GOODWE_KEY, '1');
    save();
  }
  function addPendingShanghaiPowerInstall() {
    if (localStorage.getItem(PENDING_SHANGHAI_POWER_INSTALL_KEY)) return;
    const job = makeJob({company:'上海电力安装第二工程有限公司',title:'2027届校园招聘（电气技术员 / 金属焊接工程师 / 热动技术员）',city:'',salary:'',url:SHANGHAI_POWER_INSTALL_URL,urls:[SHANGHAI_POWER_INSTALL_URL],linkParseStatus:'已解析',type:'校招',source:'招聘简章',raw:SHANGHAI_POWER_INSTALL_TEXT,raw_text:SHANGHAI_POWER_INSTALL_TEXT,status:'待筛选',notes:'国有企业，中国电建所属；简章未列明具体薪资和工作地点；附件中的中国电建小程序投递二维码和微信群二维码已在备注中保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SHANGHAI_POWER_INSTALL_KEY, '1');
    save();
  }
  function addPendingJaten() {
    if (localStorage.getItem(PENDING_JATEN_KEY)) return;
    const job = makeJob({company:'嘉腾机器人',title:'2027届校园招聘（算法 / 软件 / 测试 / 机械 / 电气 / 项目 / 方案 / 销售 / 管理）',city:'',salary:'12-50万元/年（高级工程师30-50万元/年）',url:'',urls:[],linkParseStatus:'待解析',type:'校招',source:'图片',raw:JATEN_TEXT,raw_text:JATEN_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘需求共82人；图片提供HR微信和公众号二维码，未提供可复制投递链接；统一工作地点未注明，以具体岗位页面或HR通知为准。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_JATEN_KEY, '1');
    save();
  }
  function addPendingSunshineInsurance() {
    if (localStorage.getItem(PENDING_SUNSHINE_INSURANCE_KEY)) return;
    const job = makeJob({company:'阳光保险集团股份有限公司',title:'2027届秋季校园招聘（管培 / 风控 / 法务 / 精算 / 智能应用研发）',city:'北京、武汉、绵阳',salary:'',url:SUNSHINE_INSURANCE_URL,urls:[SUNSHINE_INSURANCE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SUNSHINE_INSURANCE_TEXT,raw_text:SUNSHINE_INSURANCE_TEXT,status:'待筛选',notes:`招聘交流群：${SUNSHINE_INSURANCE_GROUP_URL}；岗位和工作地点以具体职位页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SUNSHINE_INSURANCE_KEY, '1');
    save();
  }
  function addPendingToutiao() {
    if (localStorage.getItem(PENDING_TOUTIAO_KEY)) return;
    const job = makeJob({company:'北京今日头条科技有限公司',title:'2027届秋季校园招聘（产品 / 开发 / AI / 运营 / BD / 人力）',city:'北京、上海、深圳、成都、杭州等',salary:'',url:TOUTIAO_URL,urls:[TOUTIAO_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:TOUTIAO_TEXT,raw_text:TOUTIAO_TEXT,status:'待筛选',tags:['AI/Agent'],notes:`招聘交流群：${TOUTIAO_GROUP_URL}；具体岗位要求和招聘安排以职位页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_TOUTIAO_KEY, '1');
    save();
  }
  function addPendingBluefocus() {
    if (localStorage.getItem(PENDING_BLUEFOCUS_KEY)) return;
    const job = makeJob({company:'北京蓝色光标数据科技集团股份有限公司',title:'2027届AI超级基地计划（AIBuilder研发 / AIBuilder产品 / AI营销解决方案 / AI创作者）',city:'上海、北京、深圳、广州、杭州、东南亚等9个城市',salary:'具体以HR/Offer为准',url:BLUEFOCUS_REFERRAL_URL,urls:[BLUEFOCUS_REFERRAL_URL],linkParseStatus:'已解析',type:'校招',source:'招聘简章',raw:BLUEFOCUS_TEXT,raw_text:BLUEFOCUS_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'北京科技大学文法学院推荐文件；投递时请注明推荐学院及专业；海报二维码投递说明已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_BLUEFOCUS_KEY, '1');
    save();
  }
  function addPendingYaoPin() {
    if (localStorage.getItem(PENDING_YAO_PIN_KEY)) return;
    const job = makeJob({company:'姚品国际',title:'2027届管培生（潮玩 / TCG / 零售 / 快消）',city:'上海、北京、广州、深圳、南京、武汉、长沙、西安、合肥、大连、川渝、东北等',salary:'年薪15-30W',url:YAO_PIN_URL,urls:[YAO_PIN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:YAO_PIN_TEXT,raw_text:YAO_PIN_TEXT,status:'待筛选',notes:'招聘对象：2026-2027届毕业生；潮玩、零售、快消爱好者优先；目标院校专属内推码：DSyPC6Zv；内推简历优先筛选。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_YAO_PIN_KEY, '1');
    save();
  }
  function addPendingDataInstitute() {
    if (localStorage.getItem(PENDING_DATA_INSTITUTE_KEY)) return;
    const job = makeJob({company:'数据所',title:'2027届校园招聘（密码安全 / 嵌入式 / 软件 / FPGA / 芯片 / AI / 硬件 / 信号处理等）',city:'北京、西安、青海、上海、东莞、武汉',salary:'协议薪酬与安家费',url:DATA_INSTITUTE_URL,urls:[DATA_INSTITUTE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:DATA_INSTITUTE_TEXT,raw_text:DATA_INSTITUTE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'中央企业；解决北京户口；福利包括星火人才专项、安家费、青年员工宿舍等；单位全称和具体薪酬以网申页面为准。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_DATA_INSTITUTE_KEY, '1');
    save();
  }
  function addPendingCscec4Install() {
    if (localStorage.getItem(PENDING_CCSCEC4_INSTALL_KEY)) return;
    const job = makeJob({company:'中建四局安装工程有限公司',title:'2027届校园招聘（安装工程 / 智能建造 / 新能源 / 工程管理等）',city:'广东、贵州、安徽、福建、湖北、四川、江苏、新疆、海南、河南、陕西、青海、东三省等',salary:'基本工资+绩效奖金+福利+津补贴',url:CCSCEC4_INSTALL_URL,urls:[CCSCEC4_INSTALL_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CCSCEC4_INSTALL_TEXT,raw_text:CCSCEC4_INSTALL_TEXT,status:'待筛选',notes:'中建四局直属大型建筑专业公司；福利含五险一金、企业年金、免费食宿等；招聘流程：简历→线上测试→面试→录用函→三方签约。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CCSCEC4_INSTALL_KEY, '1');
    save();
  }
  function addPendingHonorBeike() {
    if (localStorage.getItem(PENDING_HONOR_BEIKE_KEY)) return;
    const job = makeJob({company:'荣耀',title:'2027届校园招聘北京科技大学专场宣讲会',city:'北京（北京科技大学）',salary:'',deadline:'2026-09-30',url:[HONOR_BEIKE_SIGNUP_URL,HONOR_CAREER_URL].join('\n'),urls:[HONOR_BEIKE_SIGNUP_URL,HONOR_CAREER_URL],linkParseStatus:'已解析',type:'校招',source:'校园宣讲会',raw:HONOR_BEIKE_TEXT,raw_text:HONOR_BEIKE_TEXT,status:'待筛选',notes:'宣讲时间：2026年9月22日10:00；地点：时代凌宇报告厅；业务大牛和HR现场交流；简历截止时间：2026年9月30日24:00。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HONOR_BEIKE_KEY, '1');
    save();
  }
  function addPendingKingsoftGame() {
    if (localStorage.getItem(PENDING_KINGSOFT_GAME_KEY)) return;
    const job = makeJob({company:'北京金山软件有限公司',title:'2027届秋招（游戏研发 / 策划 / 产品运营 / 市场推广）',city:'北京、成都、武汉',salary:'',url:KINGSOFT_GAME_URL,urls:[KINGSOFT_GAME_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:KINGSOFT_GAME_TEXT,raw_text:KINGSOFT_GAME_TEXT,status:'待筛选',notes:`招聘对象：2027届应届毕业生；共享招聘交流群：${KINGSOFT_GROUP_URL}；岗位和具体薪资以投递页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_KINGSOFT_GAME_KEY, '1');
    save();
  }
  function addPendingFotonRi() {
    if (localStorage.getItem(PENDING_FOTON_RI_KEY)) return;
    const job = makeJob({company:'北汽福田工程研究总院',title:'2027届校园招聘（整车工程 / 智能网联 / 新能源 / 智能驾驶 / 博士后工作站）',city:'北京、广州、潍坊、诸城、青岛、长沙',salary:'',url:'',urls:[],linkParseStatus:'待解析',type:'校招',source:'图片/海报',raw:FOTON_RI_TEXT,raw_text:FOTON_RI_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2027届全球应届毕业生，博士、硕士；联系人：李经理010-56716708；邮箱：litongtong4@foton.com.cn；海报未提供可复制网申链接。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_FOTON_RI_KEY, '1');
    save();
  }
  function addPendingQxgyWechat() {
    if (localStorage.getItem(PENDING_QXGY_WECHAT_KEY)) return;
    const job = makeJob({company:'待确认',title:'待确认（微信文章）',city:'',salary:'',url:QXGY_WECHAT_URL,urls:[QXGY_WECHAT_URL],linkParseStatus:'需人工打开',type:'其他',source:'微信公众号',raw:QXGY_WECHAT_TEXT,raw_text:QXGY_WECHAT_TEXT,status:'待筛选',notes:'当前仅收到微信公众号文章链接，网页暂时无法自动读取；单位名称、岗位、地点、招聘类型及投递方式待人工打开文章后补充。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_QXGY_WECHAT_KEY, '1');
    save();
  }
  function addPendingXcmg() {
    if (localStorage.getItem(PENDING_XCMG_KEY)) return;
    const job = makeJob({company:'徐工集团',title:'2027届校园招聘（岗位待查看）',city:'',salary:'',url:XCMG_URL,urls:[XCMG_URL],linkParseStatus:'已解析',type:'校招',source:'网申链接',raw:XCMG_TEXT,raw_text:XCMG_TEXT,status:'待筛选',notes:'当前仅收到徐工集团网申入口；具体岗位、工作地点、招聘对象和薪酬请以职位页面为准。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_XCMG_KEY, '1');
    save();
  }
  function addPendingShantui() {
    if (localStorage.getItem(PENDING_SHANTUI_KEY)) return;
    const job = makeJob({company:'山推工程机械股份有限公司',title:'2027届校园招聘北京科技大学站（研发 / 营销 / 信息技术 / 财务 / 行政）',city:'济宁、临沂、青岛、扬州、德州、济南、武汉',salary:'本科10.8-12万/年；硕士13.2-14.4万/年；博士面议',deadline:'2026-09-22',url:SHANTUI_URL,urls:[SHANTUI_URL],linkParseStatus:'已解析',type:'校招',source:'校园宣讲会',raw:SHANTUI_TEXT,raw_text:SHANTUI_TEXT,status:'待筛选',notes:'宣讲时间：2026年9月22日19:00；地点：逸夫楼601；本科及以上；福利含六险二金、人才公寓、租房补贴、免费午餐、免费班车等。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SHANTUI_KEY, '1');
    save();
  }
  function addPendingCcsGuangdong() {
    if (localStorage.getItem(PENDING_CCS_GUANGDONG_KEY)) return;
    const job = makeJob({company:'中国通信服务广东公司',title:'2027届秋招（人工智能 / 计算机 / 通信 / 自动化 / 电力 / 职能等）',city:'广东各地市、北京、湖南、湖北、广西、重庆、陕西、河南、河北、江苏、上海、天津、港澳及菲律宾/马来西亚等海外地区',salary:'',url:CCS_GUANGDONG_URL,urls:[CCS_GUANGDONG_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CCS_GUANGDONG_TEXT,raw_text:CCS_GUANGDONG_TEXT,status:'待筛选',notes:'千亿级央企上市集团；专业覆盖广；福利含六险一金、住宿、餐补、企业年金和带薪年假；具体岗位及薪酬以网申页面为准。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CCS_GUANGDONG_KEY, '1');
    save();
  }
  function addPendingOpple() {
    if (localStorage.getItem(PENDING_OPPLE_KEY)) return;
    const job = makeJob({company:'欧普照明股份有限公司',title:'2027届秋招（电商 / 制造 / 采购 / 设计 / HR / AI开发 / 财务培训生）',city:'上海、苏州、中山',salary:'',url:OPPLE_URL,urls:[OPPLE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:OPPLE_TEXT,raw_text:OPPLE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:`招聘对象：2027届应届毕业生；共享招聘交流群：${OPPLE_GROUP_URL}；岗位和具体薪资以投递页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_OPPLE_KEY, '1');
    save();
  }
  function addPendingIntime() {
    if (localStorage.getItem(PENDING_INTIME_KEY)) return;
    const job = makeJob({company:'浙江银泰百货有限公司',title:'2027届秋招（AI系统工程 / 智能账务 / 业务 / 工程设计 / 财务 / 运营 / 采购管培）',city:'北京、杭州、西安',salary:'',url:INTIME_URL,urls:[INTIME_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:INTIME_TEXT,raw_text:INTIME_TEXT,status:'待筛选',tags:['AI/Agent'],notes:`招聘对象：2027届应届毕业生；共享招聘交流群：${INTIME_GROUP_URL}；岗位和具体薪资以投递页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_INTIME_KEY, '1');
    save();
  }
  function addPendingCarizon() {
    if (localStorage.getItem(PENDING_CARIZON_KEY)) return;
    const job = makeJob({company:'酷睿程',title:'2027届秋招（自动驾驶算法 / 软件研发 / 测试）',city:'北京、上海',salary:'行业竞争力薪资',url:CARIZON_URL,urls:[CARIZON_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:CARIZON_TEXT,raw_text:CARIZON_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'大众CARIAD与地平线合资智驾企业；招聘对象：2027届海内外高校毕业生；内推码：Y2UTPSN；福利含住房补贴、弹性工作和带薪年假。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_CARIZON_KEY, '1');
    save();
  }
  function addPendingSgmicroBeijing() {
    if (localStorage.getItem(PENDING_SGMICRO_BEIJING_KEY)) return;
    const job = makeJob({company:'圣邦微电子',title:'2027届校园招聘北京专场宣讲会及会后笔试',city:'北京、哈尔滨、大连、上海、苏州、杭州、江阴、厦门、深圳、武汉、成都、香港等',salary:'行业竞争力薪酬；年度奖金；股票期权；专利奖/项目奖等',deadline:'2026-09-23',url:SGMICRO_BEIJING_URL,urls:[SGMICRO_BEIJING_URL],linkParseStatus:'需人工打开',type:'校招',source:'校园宣讲会',raw:SGMICRO_BEIJING_TEXT,raw_text:SGMICRO_BEIJING_TEXT,status:'待筛选',notes:'宣讲时间：2026年9月23日14:00；地点：北京丽亭华苑酒店三层鸿运厅；会后现场笔试，请携带纸质简历；扫码进群了解后续安排。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SGMICRO_BEIJING_KEY, '1');
    save();
  }
  function addPendingJoyin() {
    if (localStorage.getItem(PENDING_JOYIN_KEY)) return;
    const job = makeJob({company:'JOYIN乐漾',title:'2027届秋季校园招聘（跨境电商 / 产品 / 财务HR / 质量 / 设计 / AI）',city:'上海、深圳、长沙',salary:'有竞争力薪资+年终奖',url:JOYIN_URL,urls:[JOYIN_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:JOYIN_TEXT,raw_text:JOYIN_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2027届海内外毕业生，毕业时间2026年8月至2027年8月；内推码：T6UNW13；内推群链接已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_JOYIN_KEY, '1');
    save();
  }
  function addPendingNfc() {
    if (localStorage.getItem(PENDING_NFC_KEY)) return;
    const job = makeJob({company:'中国有色金属建设股份有限公司（中色股份）',title:'2027届校园招聘北京科技大学专场（工程 / 数智化 / 财务 / 法务 / 职能）',city:'北京总部、海外项目部及子公司',salary:'本科20-23万/年；硕士24-26万/年；博士28-30万/年；海外派驻为北京总部2-2.5倍',url:NFC_URL,urls:[NFC_URL],linkParseStatus:'已解析',type:'校招',source:'校园双选会',raw:NFC_TEXT,raw_text:NFC_TEXT,status:'待筛选',notes:'双选时间：2026年9月22日14:00；地点：时代凌宇报告厅中色股份展位；招聘对象为2027届本硕博；福利含北京落户、七险两金、免费三餐和多项津贴。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_NFC_KEY, '1');
    save();
  }
  function addPendingH3c() {
    if (localStorage.getItem(PENDING_H3C_KEY)) return;
    const job = makeJob({company:'H3C新华三集团',title:'2027届校园招聘北京科技大学宣讲会（技术支持 / AI / 软件 / 硬件 / 营销 / 供应链）',city:'全国（北京、杭州、大连等）及海外',salary:'',deadline:'2026-09-21',url:H3C_URL,urls:[H3C_URL],linkParseStatus:'已解析',type:'校招',source:'校园宣讲会',raw:H3C_TEXT,raw_text:H3C_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'宣讲时间：2026年9月21日19:00；地点：逸夫楼205；核心岗位为技术支持工程师；理工类专业均可投递。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_H3C_KEY, '1');
    save();
  }
  function addPendingSmoore() {
    if (localStorage.getItem(PENDING_SMOORE_KEY)) return;
    const job = makeJob({company:'思摩尔国际',title:'2027全球校园招聘（技术研发 / 产品营销 / 综合职能 / 生产运营）',city:'深圳、长沙、上海、昆明、江门等国内多地',salary:'',url:SMOORE_URL,urls:[SMOORE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SMOORE_TEXT,raw_text:SMOORE_TEXT,status:'待筛选',notes:'摩范生：2026年9月至2027年7月毕业的本硕；摩术生：2025年9月至2027年9月毕业的博士；内推链接已保留。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SMOORE_KEY, '1');
    save();
  }
  function mergeKtcRecommendUpdate() {
    if (localStorage.getItem(PENDING_KTC_RECOMMEND_UPDATE_KEY)) return;
    let job = state.jobs.find(j => normalize(j.company).includes('康冠科技') || getUrls(j).some(url => url.includes('careerktc.zhiye.com')));
    if (!job) {
      job = makeJob({company:'康冠科技',title:'2027届秋季校园招聘（技术研发 / 产品设计 / 市场运营）',city:'',salary:'',url:KTC_URL,urls:[KTC_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:KTC_RECOMMEND_TEXT,raw_text:KTC_RECOMMEND_TEXT,status:'待筛选',notes:'推荐码：EVVPT9（填写推荐码，简历优先筛选）。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    } else {
      const urls = getUrls(job);
      if (!urls.includes(KTC_URL)) urls.push(KTC_URL);
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '康冠科技';
      job.title = '2027届秋季校园招聘（技术研发 / 产品设计 / 市场运营）';
      job.type = '校招';
      job.linkParseStatus = '已解析';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 秋招补充信息 ---\n${KTC_RECOMMEND_TEXT}`.trim();
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}推荐码：EVVPT9，填写后简历优先筛选。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_KTC_RECOMMEND_UPDATE_KEY, '1');
    save();
  }
  function addPendingGreeElectronics() {
    if (localStorage.getItem(PENDING_GREE_ELECTRONICS_KEY)) return;
    const job = makeJob({company:'珠海格力电子元器件有限公司',title:'2027届秋招（研发测试 / 芯片工艺 / 物控 / 模块设备 / 产品 / 应用设计 / 销售）',city:'珠海',salary:'',url:GREE_ELECTRONICS_URL,urls:[GREE_ELECTRONICS_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:GREE_ELECTRONICS_TEXT,raw_text:GREE_ELECTRONICS_TEXT,status:'待筛选',notes:`招聘对象：2027届应届毕业生；共享招聘交流群：${GREE_ELECTRONICS_GROUP_URL}；岗位和具体薪资以投递页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_GREE_ELECTRONICS_KEY, '1');
    save();
  }
  function addPendingAlibabaLingxi() {
    if (localStorage.getItem(PENDING_ALIBABA_LINGXI_KEY)) return;
    const job = makeJob({company:'阿里巴巴灵犀互娱',title:'2027届校园招聘（游戏策划 / 游戏技术 / 算法AI / 设计 / 产品运营营销 / 项目服务）',city:'广州、上海、北京',salary:'',url:ALIBABA_LINGXI_URL,urls:[ALIBABA_LINGXI_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ALIBABA_LINGXI_TEXT,raw_text:ALIBABA_LINGXI_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2027届海内外毕业生，毕业时间2026年11月至2027年10月；不限专业；40+岗位。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ALIBABA_LINGXI_KEY, '1');
    save();
  }
  function addPendingQianli() {
    if (localStorage.getItem(PENDING_QIANLI_KEY)) return;
    const job = makeJob({company:'千里科技（AFARI）',title:'2027届校园招聘（智能驾驶 / 座舱 / Robotaxi / 算法 / 研发 / 产品）',city:'上海、北京、成都、杭州、重庆、宁波等',salary:'有竞争力的薪资待遇',url:QIANLI_URL,urls:[QIANLI_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:QIANLI_TEXT,raw_text:QIANLI_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'内推码：DSX8Nh7R；普通校招与AFARI-X计划均已保留；每个项目最多投递2个岗位，投递后不支持修改职位。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_QIANLI_KEY, '1');
    save();
  }
  function addPendingSupcon() {
    if (localStorage.getItem(PENDING_SUPCON_KEY)) return;
    const job = makeJob({company:'中控技术股份有限公司',title:'2027届秋招（技术营销 / 海外销售 / 渠道 / 质量 / 硬件 / 装配）',city:'杭州；部分岗位待明确',salary:'',url:SUPCON_URL,urls:[SUPCON_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:SUPCON_TEXT,raw_text:SUPCON_TEXT,status:'待筛选',tags:['AI/Agent'],notes:`招聘对象：2027届应届毕业生；共享招聘交流群：${SUPCON_GROUP_URL}；岗位和具体薪资以投递页面为准。`});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_SUPCON_KEY, '1');
    save();
  }
  function addPendingNovastar() {
    if (localStorage.getItem(PENDING_NOVASTAR_KEY)) return;
    const job = makeJob({company:'诺瓦星云',title:'2027届校园招聘（软件 / 嵌入式 / 算法 / FPGA / 硬件 / 测试 / 营销）',city:'西安、深圳、北京、海外',salary:'',url:NOVASTAR_URL,urls:[NOVASTAR_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:NOVASTAR_TEXT,raw_text:NOVASTAR_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'研发方向涵盖软件、嵌入式、算法、FPGA、硬件、模拟电路和测试；营销方向含海外岗位；福利含星火计划、导师带教和双晋升通道。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_NOVASTAR_KEY, '1');
    save();
  }
  function addPendingHunanTalentFair() {
    if (localStorage.getItem(PENDING_HUNAN_TALENT_FAIR_KEY)) return;
    const job = makeJob({company:'湖南人才市场（智汇潇湘、才聚湖南专场）',title:'北京科技大学专场宣讲会（人工智能 / 芯片 / 自动驾驶 / 智能制造 / 软件研发）',city:'北京（北京科技大学）',salary:'',deadline:'2026-09-22',url:HUNAN_TALENT_FAIR_URL,urls:[HUNAN_TALENT_FAIR_URL],linkParseStatus:'已解析',type:'校招',source:'校园宣讲会',raw:HUNAN_TALENT_FAIR_TEXT,raw_text:HUNAN_TALENT_FAIR_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'时间：2026年9月22日17:30；地点：逸夫楼406；原文列举参会企业含拓维信息、希迪智驾、长沙楠菲微电子、衡阳镭目科技、岱勒新材料科技等。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_HUNAN_TALENT_FAIR_KEY, '1');
    save();
  }
  function addPendingRootGlobal() {
    if (localStorage.getItem(PENDING_ROOT_GLOBAL_KEY)) return;
    const job = makeJob({company:'路特创新',title:'2027届秋招（技术 / 运营 / 设计 / 综合）',city:'',salary:'',url:ROOT_GLOBAL_URL,urls:[ROOT_GLOBAL_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:ROOT_GLOBAL_TEXT,raw_text:ROOT_GLOBAL_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'岗位涵盖结构、嵌入式、AI软件产品、海外营销、用户运营、项目管理、交互/体验/视觉设计、HR、物流、法务、会计等；原文未明确工作地点和薪资。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_ROOT_GLOBAL_KEY, '1');
    save();
  }
  function addPendingWondershare() {
    if (localStorage.getItem(PENDING_WONDERSHARE_KEY)) return;
    const job = makeJob({company:'万兴科技',title:'2027届全球校园招聘（研发 / 产品 / 营销 / 设计 / 职能）',city:'深圳、长沙、北京、杭州、日本东京',salary:'优秀应届生年薪可达100W',url:WONDERSHARE_URL,urls:[WONDERSHARE_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:WONDERSHARE_TEXT,raw_text:WONDERSHARE_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'学校专属推荐码：EVK4BR；招聘对象为2027届本硕博应届毕业生；福利含AI工具资源、提前转正、产品VIP和实习补贴。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_WONDERSHARE_KEY, '1');
    save();
  }
  function mergeSeresUpdate() {
    if (localStorage.getItem(PENDING_SERES_UPDATE_KEY)) return;
    let job = state.jobs.find(j => normalize(j.company).includes('赛力斯') || getUrls(j).some(url => url.includes('sokon.zhiye.com')));
    if (!job) {
      job = makeJob({company:'赛力斯集团',title:'2027届全球校园招聘（北京科技大学宣讲会）',city:'重庆、上海、成都；宣讲地点：北京科技大学时代凌宇报告厅',salary:'',url:[SERES_URL,SERES_AIVA_URL].join('\n'),urls:[SERES_URL,SERES_AIVA_URL],linkParseStatus:'已解析',type:'校招',source:'校园宣讲会',raw:SERES_UPDATE_TEXT,raw_text:SERES_UPDATE_TEXT,status:'待筛选',notes:'宣讲时间：9月16日17:30；现场可投递简历并进行业务专家一对一简单面试和咨询。'});
      if (!isDuplicate(job)) state.jobs.unshift(job);
    } else {
      const urls = getUrls(job);
      [SERES_URL, SERES_AIVA_URL].forEach(url => { if (!urls.includes(url)) urls.push(url); });
      job.urls = urls;
      job.url = urls.join('\n');
      job.company = '赛力斯集团';
      job.title = '2027届全球校园招聘（北京科技大学宣讲会）';
      job.city = '重庆、上海、成都；宣讲地点：北京科技大学时代凌宇报告厅';
      job.type = '校招';
      job.linkParseStatus = '已解析';
      job.raw = `${job.raw || job.raw_text || ''}\n\n--- 赛力斯宣讲补充信息 ---\n${SERES_UPDATE_TEXT}`;
      job.raw_text = job.raw;
      job.notes = `${job.notes ? job.notes + '；' : ''}补充宣讲时间、福利、岗位方向及赛力斯集团/赛豆科技投递链接；现场可投递并进行业务专家一对一面试咨询。`;
      job.updatedAt = Date.now();
    }
    localStorage.setItem(PENDING_SERES_UPDATE_KEY, '1');
    save();
  }
  function addPendingSept16Fairs() {
    if (localStorage.getItem(PENDING_SEPT16_FAIRS_KEY)) return;
    SEPT16_FAIR_ITEMS.forEach(item => {
      let existing = null;
      if (item.merge === 'sf') {
        existing = state.jobs.find(j => normalize(j.company).includes('四方继保') || normalize(j.company).includes('四方股份') || getUrls(j).some(url => url.includes('sf-auto1.zhiye.com')));
      } else if (item.merge === 'sugon') {
        existing = state.jobs.find(j => normalize(j.company).includes('中科曙光'));
      } else if (item.merge === 'changsha-mining') {
        existing = state.jobs.find(j => normalize(j.company).includes('长沙矿冶') || normalize(j.company).includes('长沙矿山研究院'));
      } else if (item.merge === 'cisdi') {
        existing = state.jobs.find(j => normalize(j.company).includes('中冶赛迪') || getUrls(j).some(url => url.includes('CtmID=8906856')));
      }
      const fairText = `${item.company}｜${item.title}
时间：${item.time}
地点：${item.venue}${item.kind ? `
类型：${item.kind}` : ''}
详情链接：${item.url}`;
      if (existing) {
        const urls = getUrls(existing);
        if (!urls.includes(item.url)) urls.push(item.url);
        existing.urls = urls;
        existing.url = urls.join('\n');
        existing.title = item.title;
        existing.type = '校招';
        existing.raw = `${existing.raw || existing.raw_text || ''}\n\n--- 9.16 活动补充信息 ---\n${fairText}`.trim();
        existing.raw_text = existing.raw;
        existing.notes = `${existing.notes ? existing.notes + '；' : ''}补充活动时间：${item.time}；地点：${item.venue}；详情链接已保留。`;
        existing.updatedAt = Date.now();
      } else {
        const job = makeJob({company:item.company,title:item.title,city:item.city,salary:'',url:item.url,urls:[item.url],linkParseStatus:'已解析',type:'校招',source:item.kind === '双选会' ? '校园双选会' : '校园宣讲会',raw:fairText,raw_text:fairText,status:'待筛选',notes:`活动时间：${item.time}；地点：${item.venue}；具体岗位和工作地点请以详情链接为准。`});
        if (!isDuplicate(job)) state.jobs.unshift(job);
      }
    });
    localStorage.setItem(PENDING_SEPT16_FAIRS_KEY, '1');
    save();
  }
  function addPendingSept23Fairs() {
    if (localStorage.getItem(PENDING_SEPT23_FAIRS_KEY)) return;
    SEPT23_FAIR_ITEMS.forEach(item => {
      let existing = null;
      if (item.merge === 'hirain') {
        existing = state.jobs.find(j => normalize(j.company).includes('经纬恒润') || getUrls(j).some(url => url.includes('79bacc45000245dfbfcf06b5e1f90765')));
      } else if (item.merge === 'sgs') {
        existing = state.jobs.find(j => normalize(j.company) === 'sgs' || getUrls(j).some(url => url.includes('SihQ-xL024yDX2KbhLpHHA')));
      }
      const urls = [item.url, item.detailUrl].filter(Boolean);
      const fairText = `${item.company}｜${item.title}
时间：${item.time}
地点：${item.venue}
详情链接：${item.url}${item.detailUrl ? `
活动详情：${item.detailUrl}` : ''}`;
      if (existing) {
        const existingUrls = getUrls(existing);
        urls.forEach(url => { if (!existingUrls.includes(url)) existingUrls.push(url); });
        existing.urls = existingUrls;
        existing.url = existingUrls.join('\n');
        existing.company = item.company;
        existing.title = item.title;
        existing.city = item.city;
        existing.type = '校招';
        existing.source = item.city === '线上' ? '线上宣讲会' : '校园宣讲会';
        existing.linkParseStatus = '已解析';
        existing.raw = `${existing.raw || existing.raw_text || ''}\n\n--- 9.23 活动补充信息 ---\n${fairText}`.trim();
        existing.raw_text = existing.raw;
        existing.notes = `${existing.notes ? existing.notes + '；' : ''}补充活动时间：${item.time}；地点：${item.venue}；详情链接已保留。`;
        existing.updatedAt = Date.now();
      } else {
        const job = makeJob({company:item.company,title:item.title,city:item.city,salary:'',url:urls.join('\n'),urls,linkParseStatus:'已解析',type:'校招',source:item.city === '线上' ? '线上宣讲会' : '校园宣讲会',raw:fairText,raw_text:fairText,status:'待筛选',notes:`活动时间：${item.time}；地点：${item.venue}；具体岗位和招聘安排请以详情链接为准。`});
        if (!isDuplicate(job)) state.jobs.unshift(job);
      }
    });
    localStorage.setItem(PENDING_SEPT23_FAIRS_KEY, '1');
    save();
  }
  function addPendingYstNfsWantai() {
    if (localStorage.getItem(PENDING_YST_NFS_WANTAI_KEY)) return;
    const job = makeJob({company:'养生堂·农夫山泉·万泰生物',title:'2027届校园招聘（人才计划 / 行销 / 生产 / 信息技术 / 研发 / 生物医药 / 品牌）',city:'',salary:'',url:YST_NFS_WANTAI_URL,urls:[YST_NFS_WANTAI_URL],linkParseStatus:'已解析',type:'校招',source:'QQ/微信群',raw:YST_NFS_WANTAI_TEXT,raw_text:YST_NFS_WANTAI_TEXT,status:'待筛选',tags:['AI/Agent'],notes:'招聘对象：2025-2027届毕业生；内推码：DSCJQN4a；岗位覆盖养生堂、农夫山泉、万泰生物相关业务；工作地点和具体薪酬以岗位页面为准。'});
    if (!isDuplicate(job)) state.jobs.unshift(job);
    localStorage.setItem(PENDING_YST_NFS_WANTAI_KEY, '1');
    save();
  }
  function repairKtcLinks() {
    const job = state.jobs.find(j => j.company === '康冠科技');
    if (!job) return;
    const urls = getUrls(job);
    if (urls.includes(KTC_IMAGE_URL)) return;
    urls.push(KTC_IMAGE_URL);
    job.urls = urls;
    job.url = urls.join('\n');
    job.updatedAt = Date.now();
    job.notes = `${job.notes ? job.notes + '；' : ''}图片补充确认 PC 端网申地址：https://careerktc.zhiye.com/campus`;
    save();
  }
  function statusOptions(selected='待筛选') { return STATUSES.map(s => `<option ${s===selected?'selected':''}>${s}</option>`).join(''); }
  function linkStatusOptions(selected='待解析') { return LINK_STATUSES.map(s => `<option ${s===selected?'selected':''}>${s}</option>`).join(''); }
  function getUrls(job) { const fromUrl=String(job.url || '').split(/\r?\n/).map(s=>s.trim()).filter(Boolean); return fromUrl.length ? fromUrl : (Array.isArray(job.urls) ? job.urls.filter(Boolean) : []); }
  function tagsHTML(tags=[]) { return tags.map(t => `<span class="tag ${t==='电机/控制'?'control':''}">${esc(t)}</span>`).join(''); }

  function renderStats() {
    const names = [['待筛选','待筛选数量'],['准备投','准备投数量'],['已投递','已投数量'],['已测评','测评数量'],['面试','面试数量'],['Offer','Offer数量']];
    $('stats').innerHTML = names.map(([status,label]) => `<div class="stat"><b>${state.jobs.filter(j=>j.status===status).length}</b><span>${label}</span></div>`).join('');
  }
  function getFilters() { return {company:$('companyFilter').value.trim().toLowerCase(),city:$('cityFilter').value.trim().toLowerCase(),keyword:$('keywordFilter').value.trim().toLowerCase(),status:$('statusFilter').value,tag:$('tagFilter').value}; }
  function filteredJobs() {
    const f = getFilters();
    return state.jobs.filter(j => (!f.company || j.company.toLowerCase().includes(f.company)) && (!f.city || j.city.toLowerCase().includes(f.city)) && (!f.keyword || j.title.toLowerCase().includes(f.keyword)) && (!f.status || j.status===f.status) && (!f.tag || j.tags.includes(f.tag)));
  }
  function renderList() {
    const jobs = filteredJobs();
    $('resultCount').textContent = `（${jobs.length}/${state.jobs.length}）`;
    $('jobTableBody').innerHTML = jobs.map(j => `<tr>
      <td><span class="company-cell">${esc(j.company || '待确认')}</span>${j.deadline?`<span class="subtext">截止：${esc(j.deadline)}</span>`:''}</td>
      <td><span class="title-cell">${esc(j.title || '待确认')}</span><span class="subtext">匹配：${j.match === '' ? '—' : esc(j.match) + '分'} · 简历：${esc(j.resume || '都可以')} · 优先级：${esc(j.priority || 'B')}</span><div>${tagsHTML(j.tags)}</div></td>
      <td>${esc(j.city || '—')}</td><td>${esc(j.salary || '—')}</td>
      <td>${getUrls(j).length ? getUrls(j).map((url,i)=>`<a class="link" href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>`).join('<br>') : '<span class="subtext">暂无链接</span>'}</td>
      <td><span class="badge link-status-badge">${esc(j.linkParseStatus || '待解析')}</span><span class="subtext">${getUrls(j).length} 个 URL</span></td>
      <td><span class="source">${esc(j.source || '—')}</span><span class="subtext">${esc(j.type || '—')}</span></td>
      <td><span class="badge status-badge status-${esc(j.status)}">${esc(j.status)}</span></td>
      <td class="row-actions"><button class="text-button" data-edit="${esc(j.id)}">编辑</button><button class="text-button delete" data-delete="${esc(j.id)}">删除</button></td>
    </tr>`).join('');
    $('emptyState').classList.toggle('hidden', jobs.length > 0);
  }
  function render() {
    renderStats(); renderList();
    if (!$('statusFilter').options.length || $('statusFilter').options.length === 1) $('statusFilter').innerHTML = '<option value="">全部状态</option>' + statusOptions('');
  }
  function parseField(text, labels) {
    const label = labels.join('|');
    const re = new RegExp(`(?:${label})\\s*[】\\]]?\\s*[：:]?\\s*([^\\n\\r]+)`, 'i');
    return (text.match(re)?.[1] || '').trim().replace(/[。；;]+$/,'');
  }
  function parseBlock(raw) {
    const urls = extractUrls(raw);
    const isWeChatArticle = urls.some(url => /(?:^|\.)mp\.weixin\.qq\.com\//i.test(url));
    let company = parseField(raw,['公司','企业','招聘公司']);
    let title = parseField(raw,['岗位方向','岗位','职位','招聘岗位','招聘职位']);
    const city = parseField(raw,['城市','地点','工作地点','工作城市','base','Base']);
    const salary = parseField(raw,['薪资','薪酬','待遇']);
    const deadline = parseField(raw,['截止日期','截止时间','截止','报名截止']);
    let type = raw.includes('实习') ? '实习' : (raw.includes('社招') || raw.includes('社会招聘') ? '社招' : (raw.includes('校招') || raw.includes('校园招聘') ? '校招' : '其他'));
    const cityGuess = city || (raw.match(/(北京|上海|广州|深圳|杭州|南京|苏州|成都|武汉|西安|重庆|天津|厦门|合肥|香港|海外)/)?.[1] || '');
    if (!company) company = (raw.match(/^\s*([A-Za-z\u4e00-\u9fff][^\n\r：:]{1,30}?)(?:研发中心)?\s*\d{4}(?:届)?(?:校园)?招聘/i)?.[1] || '').trim();
    if (!company) company = (raw.match(/^\s*([^\n\r：:]{2,35})(?:招聘|诚招|校招|实习)/m)?.[1] || '').trim();
    if (!title && /岗位方向/.test(raw)) title = parseField(raw,['岗位方向']);
    if (!title && !isWeChatArticle) title = (raw.match(/(?:招聘|招募|岗位需求)[：:]?\s*([^\n\r]{2,45})/i)?.[1] || '').trim();
    if (isWeChatArticle && !title) title = '待确认（微信文章）';
    const tags = /(AI|人工智能|大模型|机器学习|深度学习|Agent|智能驾驶)/i.test(raw) ? ['AI/Agent'] : [];
    if (/(电机|控制算法|运动控制|嵌入式控制)/i.test(raw)) tags.push('电机/控制');
    return makeJob({company:company || '待确认',title:title || '待确认',city:cityGuess,salary,url:urls.join('\n'),urls,linkParseStatus:isWeChatArticle ? '需人工打开' : (urls.length ? '已解析' : '待解析'),deadline,type,tags,raw,raw_text:raw});
  }
  function extractUrls(text) { return (String(text || '').match(/https?:\/\/[^\s<>"'()\]]+/gi) || []).map(url => url.replace(/\\([_])/g,'$1').replace(/[，。；;、）》】\]>,]+$/g,'')); }
  function splitBlocks(text) {
    const blank = text.split(/\r?\n\s*\r?\n+/).map(s=>s.trim()).filter(Boolean);
    if (blank.length > 1) return blank;
    const lines = text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    const starts = /^(?:\d+[.、]\s+|第\s*\d+\s*[条个份]|[-—]{3,}|岗位\s*\d+\s*[：:]|职位\s*\d+\s*[：:])/;
    const blocks = []; let current=[];
    lines.forEach(line => { if (current.length && starts.test(line)) { blocks.push(current.join('\n')); current=[line]; } else current.push(line); });
    if (current.length) blocks.push(current.join('\n'));
    return blocks.length ? blocks : [text.trim()];
  }
  function showSplitPreview() {
    const text = $('pasteInput').value.trim();
    if (!text) return toast('请先粘贴招聘信息');
    state.drafts = splitBlocks(text).map(parseBlock);
    renderDrafts();
  }
  function renderDrafts() {
    const box = $('splitPreview');
    if (!state.drafts.length) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    box.innerHTML = `<div class="preview-head"><strong>识别预览（${state.drafts.length} 条）</strong><div><button id="cancelDraftBtn" class="button light">取消</button> <button id="addDraftsBtn" class="button primary">加入岗位列表</button></div></div><div class="preview-grid">${state.drafts.map((j,i)=>`<div class="preview-item" data-draft="${i}"><button class="remove-draft" data-remove-draft="${i}">移除</button><h3>岗位 ${i+1}</h3><div class="preview-fields"><label>公司<input data-field="company" value="${esc(j.company)}"></label><label>岗位<input data-field="title" value="${esc(j.title)}"></label><label>城市<input data-field="city" value="${esc(j.city)}"></label><label>薪资<input data-field="salary" value="${esc(j.salary)}"></label><label class="wide">原始 URL（每行一个）<textarea data-field="url" placeholder="保留全部 URL">${esc(j.url)}</textarea></label><label>链接解析状态<select data-field="linkParseStatus">${linkStatusOptions(j.linkParseStatus)}</select></label><label>截止日期<input data-field="deadline" value="${esc(j.deadline)}"></label><label>招聘类型<select data-field="type"><option ${j.type==='校招'?'selected':''}>校招</option><option ${j.type==='实习'?'selected':''}>实习</option><option ${j.type==='社招'?'selected':''}>社招</option><option ${j.type==='其他'?'selected':''}>其他</option></select></label><label>状态<select data-field="status">${statusOptions(j.status)}</select></label><label class="wide">原始招聘文本<textarea data-field="raw">${esc(j.raw)}</textarea></label></div></div>`).join('')}</div>`;
  }
  function syncDraft(target) { const card=target.closest('[data-draft]'); if(!card)return; const j=state.drafts[Number(card.dataset.draft)]; const field=target.dataset.field; if(!j || !field)return; j[field]=target.value; if(field==='url')j.urls=target.value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean); if(field==='raw')j.raw_text=target.value; }
  function isSharedRedirectUrl(url) { return /^https?:\/\/hm\.wshotoai\.cn\/d\//i.test(String(url || '').trim()); }
  function isDuplicate(candidate, ignoreId='') { const c=normalize(candidate.company)+'|'+normalize(candidate.title); const candidateUrls=getUrls(candidate).map(normalize); return state.jobs.find(j => j.id!==ignoreId && ((c!=='|' && c===normalize(j.company)+'|'+normalize(j.title)) || candidateUrls.some(url=>url && !isSharedRedirectUrl(url) && getUrls(j).map(normalize).includes(url)))); }
  function addDrafts() {
    let added=0, skipped=0;
    state.drafts.forEach(j => { const duplicate=isDuplicate(j); if(duplicate) { skipped++; } else { j.source='群聊粘贴'; state.jobs.unshift(makeJob(j)); added++; } });
    save(); state.drafts=[]; renderDrafts(); render();
    toast(skipped ? `已新增 ${added} 条，跳过 ${skipped} 条重复岗位` : `已新增 ${added} 条岗位`);
  }
  function openEditor(job) {
    $('editorTitle').textContent = job ? '编辑岗位' : '新增岗位';
    const j = job || makeJob();
    ['id','company','title','city','salary','type','deadline','url','match','resume','priority','raw','gptSuggestion','notes'].forEach(k => { const el=$(k==='id'?'jobId':k); if(el) el.value=j[k] ?? ''; });
    $('status').innerHTML=statusOptions(j.status); $('linkParseStatus').innerHTML=linkStatusOptions(j.linkParseStatus); $('tagAI').checked=j.tags.includes('AI/Agent'); $('tagControl').checked=j.tags.includes('电机/控制');
    $('editorModal').classList.remove('hidden'); $('editorModal').setAttribute('aria-hidden','false'); $('company').focus();
  }
  function closeEditor() { $('editorModal').classList.add('hidden'); $('editorModal').setAttribute('aria-hidden','true'); }
  function saveEditor(e) {
    e.preventDefault(); const id=$('jobId').value; const old=state.jobs.find(j=>j.id===id); const data=makeJob({id:id||cryptoId(),company:$('company').value.trim(),title:$('title').value.trim(),city:$('city').value.trim(),salary:$('salary').value.trim(),type:$('type').value,deadline:$('deadline').value.trim(),url:$('url').value.trim(),linkParseStatus:$('linkParseStatus').value,status:$('status').value,match:$('match').value,resume:$('resume').value,priority:$('priority').value,raw:$('raw').value,raw_text:$('raw').value,gptSuggestion:$('gptSuggestion').value,notes:$('notes').value,tags:[$('tagAI').checked?'AI/Agent':'',$('tagControl').checked?'电机/控制':''].filter(Boolean),source:old?.source||'手动新增',isExample:old?.isExample||false,createdAt:old?.createdAt||Date.now(),updatedAt:Date.now()});
    const duplicate=isDuplicate(data,id); if(duplicate && !confirm(`发现重复岗位：${duplicate.company} / ${duplicate.title}\n仍要保存这条岗位吗？`)) return;
    if(old) Object.assign(old,data); else state.jobs.unshift(data); save(); closeEditor(); render(); toast('岗位已保存');
  }
  function deleteJob(id) { const j=state.jobs.find(x=>x.id===id); if(!j)return; if(confirm(`确定删除“${j.company} / ${j.title}”吗？`)) { state.jobs=state.jobs.filter(x=>x.id!==id); save(); render(); toast('岗位已删除'); } }
  function startQueue() { state.queueIds=state.jobs.filter(j=>j.status==='准备投').map(j=>j.id); state.queueIndex=0; if(!state.queueIds.length)return toast('当前没有“准备投”的岗位'); $('queueModal').classList.remove('hidden'); $('queueModal').setAttribute('aria-hidden','false'); renderQueue(); }
  function currentQueueJob() { return state.jobs.find(j=>j.id===state.queueIds[state.queueIndex]); }
  function renderQueue() {
    const job=currentQueueJob(); const total=state.queueIds.length;
    $('queueProgress').textContent = job ? `第 ${state.queueIndex+1} / ${total} 条 · 只显示进入队列时状态为“准备投”的岗位` : '队列已完成';
    if(!job) { $('queueContent').innerHTML='<div class="empty">本轮投递队列已完成。<br><button class="button primary" id="queueDoneBtn" style="margin-top:14px">返回列表</button></div>'; return; }
    const urls = getUrls(job);
    const openButton = urls.length ? urls.map((url,i)=>`<a class="button primary" href="${esc(url)}" target="_blank" rel="noopener">打开链接${i+1}</a>`).join('') : '<button class="button primary" id="editQueueBtn">补充链接</button>';
    const linkBox = urls.length ? `<div class="queue-link">原始 URL（${urls.length} 个，需手动点击）：<br>${urls.map((url,i)=>`<a href="${esc(url)}" target="_blank" rel="noopener">${i+1}. ${esc(url)}</a>`).join('<br>')}</div>` : '<div class="queue-link">暂无 URL，请根据招聘原文手动补充。</div>';
    $('queueContent').innerHTML=`<div class="queue-card"><h3>${esc(job.company||'待确认')}</h3><div class="queue-title">${esc(job.title||'待确认')}</div><div class="queue-meta"><span>地点：${esc(job.city||'—')}</span><span>薪资：${esc(job.salary||'—')}</span><span>截止：${esc(job.deadline||'—')}</span><span>优先级：${esc(job.priority||'B')}</span><span>链接状态：${esc(job.linkParseStatus||'待解析')}</span></div><h4>招聘原文</h4><div class="queue-raw">${esc(job.raw||'暂无原始招聘文本')}</div>${linkBox}<h4>备注</h4><div class="queue-note">${esc(job.notes||'暂无备注')}</div><div class="queue-actions">${openButton}<button class="button primary" id="appliedBtn">已投，下一个</button><button class="button light" id="skipBtn">暂时跳过</button><button class="button light" id="notApplyBtn">不投</button><button class="button light" id="backListBtn">返回列表</button></div></div>`;
  }
  function nextQueue(action) { const job=currentQueueJob(); if(!job)return; if(action==='applied')job.status='已投递'; if(action==='notApply')job.status='不投'; save(); renderStats(); renderList(); state.queueIndex++; renderQueue(); }
  function exportJob(job) { return {...job,company:job.company||'',raw_text:job.raw_text ?? job.raw ?? '',url:getUrls(job).join('\n'),source:job.source||'',urls:getUrls(job)}; }
  function downloadFile(content,name,type) { const blob=new Blob([content],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
  function exportData() { downloadFile(JSON.stringify({version:1,exportedAt:new Date().toISOString(),jobs:state.jobs.map(exportJob)},null,2),`校招岗位备份-${new Date().toISOString().slice(0,10)}.json`,'application/json;charset=utf-8'); toast('JSON 备份文件已生成'); }
  function csvEscape(value) { return `"${String(value ?? '').replace(/"/g,'""')}"`; }
  function exportCsv() { const headers=['company','raw_text','url','source','title','city','salary','deadline','type','link_parse_status','status','tags','match','resume','priority','gpt_suggestion','notes']; const rows=state.jobs.map(j=>{const item=exportJob(j); return [item.company,item.raw_text,item.url,item.source,item.title,item.city,item.salary,item.deadline,item.type,item.linkParseStatus,item.status,(item.tags||[]).join('、'),item.match,item.resume,item.priority,item.gptSuggestion,item.notes].map(csvEscape).join(',');}); downloadFile('\ufeff'+headers.join(',')+'\n'+rows.join('\n'),`校招岗位备份-${new Date().toISOString().slice(0,10)}.csv`,'text/csv;charset=utf-8'); toast('CSV 文件已生成'); }
  function importData(file) { const reader=new FileReader(); reader.onload=()=>{try{const data=JSON.parse(reader.result); if(!Array.isArray(data.jobs))throw Error(); if(!confirm(`将导入 ${data.jobs.length} 条岗位并覆盖当前数据，确定吗？`))return; state.jobs=data.jobs.map(makeJob); save(); render(); toast('数据导入成功');}catch{alert('导入失败：JSON 格式不正确或缺少 jobs 数组。');}}; reader.readAsText(file); }
  function clearAll() { if(!confirm('确定要清空全部岗位数据吗？'))return; if(!confirm('这是最后确认：所有未导出的数据都会被删除，确定清空吗？'))return; state.jobs=[]; save(); render(); toast('数据已清空'); }
  function clearExamples() { const n=state.jobs.filter(j=>j.isExample).length; if(!n)return toast('当前没有示例岗位'); if(confirm(`确定清空 ${n} 条示例岗位吗？`)){state.jobs=state.jobs.filter(j=>!j.isExample);save();render();toast('示例岗位已清空');} }
  function toast(message) { const el=$('toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2400); }

  $('smartSplitBtn').addEventListener('click',showSplitPreview); $('pasteInput').addEventListener('input',()=>{}); $('jobForm').addEventListener('submit',saveEditor); $('startQueueBtn').addEventListener('click',startQueue); $('exportBtn').addEventListener('click',exportData); $('exportCsvBtn').addEventListener('click',exportCsv); $('importBtn').addEventListener('click',()=>$('importFile').click()); $('importFile').addEventListener('change',e=>{if(e.target.files[0])importData(e.target.files[0]);e.target.value='';}); $('clearBtn').addEventListener('click',clearAll); $('clearExamplesBtn').addEventListener('click',clearExamples);
  ['companyFilter','cityFilter','keywordFilter','statusFilter','tagFilter'].forEach(id=>$(id).addEventListener('input',()=>{saveFilters();renderList();}));
  ['statusFilter','tagFilter'].forEach(id=>$(id).addEventListener('change',()=>{saveFilters();renderList();}));
  $('resetFiltersBtn').addEventListener('click',()=>{['companyFilter','cityFilter','keywordFilter'].forEach(id=>$(id).value='');$('statusFilter').value='';$('tagFilter').value='';saveFilters();renderList();});
  document.addEventListener('click',e=>{ const edit=e.target.closest('[data-edit]'); const del=e.target.closest('[data-delete]'); const remove=e.target.closest('[data-remove-draft]'); if(edit)openEditor(state.jobs.find(j=>j.id===edit.dataset.edit)); if(del)deleteJob(del.dataset.delete); if(remove){state.drafts.splice(Number(remove.dataset.removeDraft),1);renderDrafts();} if(e.target.id==='addDraftsBtn')addDrafts(); if(e.target.id==='cancelDraftBtn'){state.drafts=[];renderDrafts();} if(e.target.matches('[data-close-editor]'))closeEditor(); if(e.target.id==='queueCloseBtn'||e.target.id==='backListBtn'||e.target.id==='queueDoneBtn'){ $('queueModal').classList.add('hidden'); $('queueModal').setAttribute('aria-hidden','true'); } if(e.target.id==='appliedBtn')nextQueue('applied'); if(e.target.id==='notApplyBtn')nextQueue('notApply'); if(e.target.id==='skipBtn'){state.queueIndex++;renderQueue();} if(e.target.id==='editQueueBtn')openEditor(currentQueueJob()); });
  $('splitPreview').addEventListener('input',e=>syncDraft(e.target)); $('splitPreview').addEventListener('change',e=>syncDraft(e.target));
  $('editorModal').addEventListener('click',e=>{if(e.target===$('editorModal'))closeEditor();}); $('queueModal').addEventListener('click',e=>{if(e.target===$('queueModal')){$('queueModal').classList.add('hidden');}});
  window.addEventListener('beforeunload',()=>{save();saveFilters();});
  load();
})();
