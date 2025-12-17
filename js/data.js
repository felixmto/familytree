/**
 * FAMILY DATA
 * 
 * TO ADD IMAGES:
 * 1. Get the direct link to your image. 
 *    - For Google Drive: Change 'drive.google.com/file/d/ID/view' to 'drive.google.com/thumbnail?id=ID&sz=w200'
 * 2. Paste the link inside the quotes for the "image" field.
 *    Example: image: "https://drive.google.com/thumbnail?id=12345&sz=w200"
 */

export const familyData = {
  id: "chiu_sau_ying",
  name: "Chiu Sau Ying",
  partner: "Chan Kam Hay", // Grandpa as partner
  image: "assets/chiu_sau_ying.jpg",
  type: "root",
  children: [
    {
      id: "wai_leen",
      name: "Wai Leen",
      partner: "Alan Chu",
      partnerImage: "assets/alan_chu.png",
      image: "assets/wai_leen.png",
      familyId: "chu",
      children: [
        { id: "anthony", name: "Anthony", image: "assets/anthony.png", children: [] },
        {
          id: "agnes",
          name: "Agnes",
          partner: "Bayani",
          partnerImage: "assets/bayani.png",
          image: "assets/agnes.png",
          children: [
            { id: "alana", name: "Alana", image: "assets/alana.png", children: [] },
            { id: "marina", name: "Marina", image: "assets/marina.png", children: [] },
            { id: "zander", name: "Zander", image: "assets/zander.png", children: [] },
            { id: "zavien", name: "Zavien", image: "assets/zavien.png", children: [] }
          ]
        },
        {
          id: "clare_leen",
          name: "Clare",
          partner: "Frank",
          partnerImage: "assets/frank.png",
          image: "assets/clare_leen.png",
          children: [
            { id: "jonah", name: "Jonah", image: "assets/jonah.png", children: [] },
            { id: "marie", name: "Marie", image: "assets/marie.png", children: [] }
          ]
        }
      ]
    },
    {
      id: "wai_han",
      name: "Wai Han",
      partner: "Tze Geen",
      partnerImage: "assets/tze_geen.png",
      image: "assets/wai_han.png",
      familyId: "tong",
      children: [
        {
          id: "clare_han",
          name: "Clare",
          partner: "Lai",
          partnerImage: "assets/lai.png",
          image: "assets/clare_han.png",
          children: [
            { id: "isaac", name: "Isaac", image: "assets/isaac.png", children: [] },
            { id: "ian", name: "Ian", image: "assets/ian.png", children: [] }
          ]
        },
        {
          id: "cecilia",
          name: "Cecilia",
          partner: "John",
          partnerImage: "assets/john.png",
          image: "assets/cecilia.png",
          children: [
            { id: "isabel", name: "Isabel", image: "assets/isabel.png", children: [] },
            { id: "nathan", name: "Nathan", image: "assets/nathan.png", children: [] }
          ]
        },
        {
          id: "chris",
          name: "Chris",
          partner: "Samantha",
          partnerImage: "assets/samantha.png",
          image: "assets/chris.png",
          children: [
            { id: "baby", name: "Baby", image: "", children: [] }
          ]
        }
      ]
    },
    {
      id: "wai_fong",
      name: "Wai Fong",
      partner: "King Wa",
      partnerImage: "assets/king_to.png",
      image: "assets/wai_fong.png",
      familyId: "to",
      children: [
        { id: "felix", name: "Felix", image: "assets/felix.png", children: [] },
        {
          id: "clement",
          name: "Clement",
          partner: "Jackie",
          partnerImage: "assets/jackie.png",
          image: "assets/clement.png",
          children: []
        }
      ]
    }
  ]
};
