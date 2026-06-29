// src/data/bd-location.ts

export const bdLocationData = {
  divisions: [
    {
      id: 1,
      name: "Barishal",
      bn_name: "বরিশাল",
      districts: [
        {
          id: 101,
          name: "Barishal",
          bn_name: "বরিশাল",
          thanas: ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Banaripara", "Gournadi", "Agailjhara", "Mehendiganj", "Muladi", "Hizla"]
        },
        {
          id: 102,
          name: "Barguna",
          bn_name: "বরগুনা",
          thanas: ["Barguna Sadar", "Amtali", "Patharghata", "Betagi", "Bamna", "Taltali"]
        },
        {
          id: 103,
          name: "Bhola",
          bn_name: "ভোলা",
          thanas: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"]
        },
        {
          id: 104,
          name: "Jhalokati",
          bn_name: "ঝালকাঠি",
          thanas: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"]
        },
        {
          id: 105,
          name: "Patuakhali",
          bn_name: "পটুয়াখালী",
          thanas: ["Patuakhali Sadar", "Bauphal", "Galachipa", "Kalapara", "Mirzaganj", "Dumki", "Dashmina", "Rangabali"]
        },
        {
          id: 106,
          name: "Pirojpur",
          bn_name: "পিরোজপুর",
          thanas: ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad (Swarupkati)", "Indurkani"]
        }
      ]
    },
    {
      id: 2,
      name: "Chattogram",
      bn_name: "চট্টগ্রাম",
      districts: [
        {
          id: 201,
          name: "Chattogram",
          bn_name: "চট্টগ্রাম",
          thanas: ["Mirsharai", "Sitakunda", "Patiya", "Anwara", "Boalkhali", "Chandananish", "Fatickchhari", "Hathazari", "Lohagara", "Rangunia", "Raozan", "Sandwip", "Satkania", "Banshkhali", "Karnafuli", "Double Mooring", "Kotwali", "Panchlaish", "Bakalia", "Halishahar", "Patenga", "Bayezid Bostami", "Khulshi", "Akbar Shah", "Chawkbazar", "EPZ", "Pahartali", "Bandar"]
        },
        {
          id: 202,
          name: "Cox's Bazar",
          bn_name: "কক্সবাজার",
          thanas: ["Cox's Bazar Sadar", "Chakaria", "Maheshkhali", "Ramu", "Teknaf", "Ukhia", "Pekua", "Kutubdia"]
        },
        {
          id: 203,
          name: "Cumilla",
          bn_name: "কুমিল্লা",
          thanas: ["Cumilla Sadar", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chouddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Muradnagar", "Nangalkot", "Titas", "Meghna", "Monohargonj", "Sadarsouth"]
        },
        {
          id: 204,
          name: "Brahmanbaria",
          bn_name: "ব্রাহ্মণবাড়িয়া",
          thanas: ["Brahmanbaria Sadar", "Ashuganj", "Bancharampur", "Bijoynagar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail", "Akhaura"]
        },
        {
          id: 205,
          name: "Chandpur",
          bn_name: "চাঁদপুর",
          thanas: ["Chandpur Sadar", "Hajiganj", "Haimchar", "Kachua", "Matlab North", "Matlab South", "Shahrasti"]
        },
        {
          id: 206,
          name: "Lakshmipur",
          bn_name: "লক্ষ্মীপুর",
          thanas: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"]
        },
        {
          id: 207,
          name: "Noakhali",
          bn_name: "নোয়াখালী",
          thanas: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Senbagh", "Sonaimuri", "Subarnachar", "Kabirhat"]
        },
        {
          id: 208,
          name: "Feni",
          bn_name: "ফেনী",
          thanas: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Sonagazi", "Fulgazi"]
        },
        {
          id: 209,
          name: "Khagrachhari",
          bn_name: "খাগড়াছড়ি",
          thanas: ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh", "Guimara"]
        },
        {
          id: 210,
          name: "Rangamati",
          bn_name: "রাঙামাটি",
          thanas: ["Rangamati Sadar", "Bagaichhari", "Barkal", "Kawkhali", "Belaichhari", "Kaptai", "Juraichhari", "Langadu", "Naniarchar", "Rajasthali"]
        },
        {
          id: 211,
          name: "Bandarban",
          bn_name: "বান্দরবান",
          thanas: ["Bandarban Sadar", "Alikadam", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"]
        }
      ]
    },
    {
      id: 3,
      name: "Dhaka",
      bn_name: "ঢাকা",
      districts: [
        {
          id: 301,
          name: "Dhaka",
          bn_name: "ঢাকা",
          thanas: ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar", "Mirpur", "Uttara", "Gulshan", "Dhanmondi", "Badda", "Motijheel", "Paltan", "Shahbagh", "Ramna", "Khilgaon", "Tejgaon", "Mohammadpur", "Jatrabari", "Demra", "Gendaria", "Lalbagh", "Chawkbazar", "Hazaribagh", "Kafrul", "Cantonment", "Pallabi", "Khilkhet", "Vatara", "Rampura", "Kamrangirchar", "Sutrapur", "Wari", "Mugda", "Turag", "Uttarkhan", "Dakshinkhan", "Darussalam", "Shah Ali", "Sher-e-Bangla Nagar", "Kadamtali", "Shyampur", "Sabujbagh", "Banani", "Rupnagar", "Bhashantek", "Hatirjheel"]
        },
        {
          id: 302,
          name: "Gazipur",
          bn_name: "গাজীপুর",
          thanas: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur", "Tongi"]
        },
        {
          id: 303,
          name: "Narayanganj",
          bn_name: "নারায়ণগঞ্জ",
          thanas: ["Narayanganj Sadar", "Araihazar", "Bandar", "Rupganj", "Sonargaon", "Siddhirganj"]
        },
        {
          id: 304,
          name: "Tangail",
          bn_name: "টাঙ্গাইল",
          thanas: ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Dhanbari"]
        },
        {
          id: 305,
          name: "Faridpur",
          bn_name: "ফরিদপুর",
          thanas: ["Faridpur Sadar", "Alfadanga", "Bhanga", "Boalmari", "Charbhadrasen", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"]
        },
        {
          id: 306,
          name: "Gopalganj",
          bn_name: "গোপালগঞ্জ",
          thanas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"]
        },
        {
          id: 307,
          name: "Kishoreganj",
          bn_name: "কিশোরগঞ্জ",
          thanas: ["Kishoreganj Sadar", "Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"]
        },
        {
          id: 308,
          name: "Madaripur",
          bn_name: "মাদারীপুর",
          thanas: ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar", "Dasar"]
        },
        {
          id: 309,
          name: "Manikganj",
          bn_name: "মানিকগঞ্জ",
          thanas: ["Manikganj Sadar", "Daulatpur", "Gheor", "Harirampur", "Saturia", "Shibalaya", "Singair"]
        },
        {
          id: 310,
          name: "Munshiganj",
          bn_name: "মুন্সিগঞ্জ",
          thanas: ["Munshiganj Sadar", "Gazaria", "Lohajang", "Sirajdikhan", "Sreenagar", "Tongibari"]
        },
        {
          id: 311,
          name: "Narsingdi",
          bn_name: "নরসিংদী",
          thanas: ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"]
        },
        {
          id: 312,
          name: "Rajbari",
          bn_name: "রাজবাড়ী",
          thanas: ["Rajbari Sadar", "Baliakandi", "Goalandaghat", "Pangsha", "Kalukhali"]
        },
        {
          id: 313,
          name: "Shariatpur",
          bn_name: "শরীয়তপুর",
          thanas: ["Shariatpur Sadar", "Damudya", "Gosairhat", "Naria", "Bhedarganj", "Zajira"]
        }
      ]
    },
    {
      id: 4,
      name: "Khulna",
      bn_name: "খুলনা",
      districts: [
        {
          id: 401,
          name: "Khulna",
          bn_name: "খুলনা",
          thanas: ["Koyra", "Dumuria", "Paikgachha", "Phultala", "Batiaghata", "Dacope", "Rupsha", "Terokhada", "Dighalia", "Khulna Sadar", "Sonadanga", "Daulatpur", "Khalishpur", "Khan Jahan Ali"]
        },
        {
          id: 402,
          name: "Bagerhat",
          bn_name: "বাগেরহাট",
          thanas: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"]
        },
        {
          id: 403,
          name: "Chuadanga",
          bn_name: "চুয়াডাঙ্গা",
          thanas: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"]
        },
        {
          id: 404,
          name: "Jashore",
          bn_name: "যশোর",
          thanas: ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chougachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"]
        },
        {
          id: 405,
          name: "Jhenaidah",
          bn_name: "ঝিনাইদহ",
          thanas: ["Jhenaidah Sadar", "Harakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"]
        },
        {
          id: 406,
          name: "Kushtia",
          bn_name: "কুষ্টিয়া",
          thanas: ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"]
        },
        {
          id: 407,
          name: "Magura",
          bn_name: "মাগুরা",
          thanas: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"]
        },
        {
          id: 408,
          name: "Meherpur",
          bn_name: "মেহেরপুর",
          thanas: ["Meherpur Sadar", "Gangni", "Mujibnagar"]
        },
        {
          id: 409,
          name: "Narail",
          bn_name: "নড়াইল",
          thanas: ["Narail Sadar", "Lohagara", "Kalia"]
        },
        {
          id: 410,
          name: "Satkhira",
          bn_name: "সাতক্ষীরা",
          thanas: ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"]
        }
      ]
    },
    {
      id: 5,
      name: "Mymensingh",
      bn_name: "ময়মনসিংহ",
      districts: [
        {
          id: 501,
          name: "Mymensingh",
          bn_name: "ময়মনসিংহ",
          thanas: ["Mymensingh Sadar", "Bhaluka", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Trishal", "Dhobaura", "Fulbaria"]
        },
        {
          id: 502,
          name: "Jamalpur",
          bn_name: "জামালপুর",
          thanas: ["Jamalpur Sadar", "Bakshiganj", "Dewanganj", "Isampur", "Madarganj", "Melandaha", "Sarishabari"]
        },
        {
          id: 503,
          name: "Netrokona",
          bn_name: "নেত্রকোণা",
          thanas: ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Purbadhala"]
        },
        {
          id: 504,
          name: "Sherpur",
          bn_name: "শেরপুর",
          thanas: ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"]
        }
      ]
    },
    {
      id: 6,
      name: "Rajshahi",
      bn_name: "রাজশাহী",
      districts: [
        {
          id: 601,
          name: "Rajshahi",
          bn_name: "রাজশাহী",
          thanas: ["Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore", "Boalia", "Rajput", "Matihar", "Shah Makhdum"]
        },
        {
          id: 602,
          name: "Bogra",
          bn_name: "বগুড়া",
          thanas: ["Bogra Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala"]
        },
        {
          id: 603,
          name: "Joypurhat",
          bn_name: "জয়পুরহাট",
          thanas: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"]
        },
        {
          id: 604,
          name: "Naogaon",
          bn_name: "নওগাঁ",
          thanas: ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadevpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"]
        },
        {
          id: 605,
          name: "Natore",
          bn_name: "নাটোর",
          thanas: ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra", "Naldanga"]
        },
        {
          id: 606,
          name: "Chapai Nawabganj",
          bn_name: "চাঁপাইনবাবগঞ্জ",
          thanas: ["Chapai Nawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"]
        },
        {
          id: 607,
          name: "Pabna",
          bn_name: "পাবনা",
          thanas: ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"]
        },
        {
          id: 608,
          name: "Sirajganj",
          bn_name: "সিরাজগঞ্জ",
          thanas: ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Rayganj", "Shahjadpur", "Tarash", "Ullahpara"]
        }
      ]
    },
    {
      id: 7,
      name: "Rangpur",
      bn_name: "রংপুর",
      districts: [
        {
          id: 701,
          name: "Rangpur",
          bn_name: "রংপুর",
          thanas: ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"]
        },
        {
          id: 702,
          name: "Dinajpur",
          bn_name: "দিনাজপুর",
          thanas: ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Phulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"]
        },
        {
          id: 703,
          name: "Gaibandha",
          bn_name: "গাইবান্ধা",
          thanas: ["Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj", "Phulchhari"]
        },
        {
          id: 704,
          name: "Kurigram",
          bn_name: "কুড়িগ্রাম",
          thanas: ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Phulbari", "Nageshwari", "Rajarhat", "Roumari", "Ulipur"]
        },
        {
          id: 705,
          name: "Lalmonirhat",
          bn_name: "লালমনিরহাট",
          thanas: ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"]
        },
        {
          id: 706,
          name: "Nilphamari",
          bn_name: "নীলফামারী",
          thanas: ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"]
        },
        {
          id: 707,
          name: "Panchagarh",
          bn_name: "পঞ্চগড়",
          thanas: ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"]
        },
        {
          id: 708,
          name: "Thakurgaon",
          bn_name: "ঠাকুরগাঁও",
          thanas: ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"]
        }
      ]
    },
    {
      id: 8,
      name: "Sylhet",
      bn_name: "সিলেট",
      districts: [
        {
          id: 801,
          name: "Sylhet",
          bn_name: "সিলেট",
          thanas: ["Sylhet Sadar", "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Zakiganj", "South Surma", "Osmani Nagar"]
        },
        {
          id: 802,
          name: "Habiganj",
          bn_name: "হবিগঞ্জ",
          thanas: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Madhabpur", "Nabiganj", "Lakhai", "Sayestaganj"]
        },
        {
          id: 803,
          name: "Moulvibazar",
          bn_name: "মৌলভীবাজার",
          thanas: ["Moulvibazar Sadar", "Barlekha", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal", "Juri"]
        },
        {
          id: 804,
          name: "Sunamganj",
          bn_name: "সুনামগঞ্জ",
          thanas: ["Sunamganj Sadar", "Bishwambharpur", "Chhatak", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Tahirpur", "Shantiganj"]
        }
      ]
    }
  ]
};