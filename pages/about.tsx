import ExtendedFooter from "@components/css/footer/extendedFooter";
import AboutComponent from "@components/css/main/about";
import MetaHead from "@components/css/meta/MetaComponent";
import { RootState } from "@redux/reducers";
import { getMetaData, getWebsiteTitleAndFooter } from "@redux/services/directUsClient";
import {  useSelector } from "react-redux";


interface TagType {
  item: {
    page: string;
    // other properties of 'item'
  };
  // other properties of 'TagType'
}
export async function getServerSideProps(context: any) {
  // Fetch the meta tag dat
  const website = await getWebsiteTitleAndFooter();
  const websiteData: any = await  getMetaData(website[0].id)
  let tags = websiteData ? websiteData.find((tag: TagType) => tag.item.page === 'about') : null;
  if (tags && tags.item && tags.item.favicon && tags.item.favicon.filename_disk){
    const awsS3BaseUrl = process.env.NEXT_PUBLIC_AWS_S3;
    tags.item.favicon.url = `${awsS3BaseUrl}/${tags.item.favicon.filename_disk}`
  }
  return {
    props: {
      tags,
    },
  };
}


const About = ({tags}: any) => {
    return (
      <>
        <MetaHead metaData={tags.item} />
        <AboutComponent/>
        <ExtendedFooter/>
      </>
    );
  };
  

  export default About;