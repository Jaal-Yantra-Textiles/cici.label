import React, { Component, useEffect } from "react";
import MorphComponent from "@components/css/animation";
import { useRouter } from "next/router";
import MetaHead from "@components/css/meta/MetaComponent";
import {  animated, useSpring } from "@react-spring/web";
import UserObservationComponent from "@components/css/observation/UserObservationComponent";
import {  getMetaData, getWebsiteTitleAndFooter } from "@redux/services/directUsClient";
import { useApiStatus } from "@components/context/ApiStatusContext";
import WithAPICheck from "@components/css/withAPICheck/withApiCheck";


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
  let tags = websiteData ? websiteData.find((tag: TagType) => tag.item.page === 'index') : null;
  return {
    props: {
      tags,
    },
  };
}



const Home = ({ tags }: any) => {
  const { apiStatus, setApiStatus } = useApiStatus();
  
  const router = useRouter();
  const { sourceType, advertType } = router.query;



  const springProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });


  return (
    <>

    <MetaHead metaData={tags.item} />
    <main>
    <animated.main style={springProps}>
      <MorphComponent />
    </animated.main>
    </main>
    <UserObservationComponent/>
      </>
  );
};

export default WithAPICheck(Home, process.env.NEXT_PUBLIC_API_URL);
