import { fetchContentData, fetchSidebarData } from '@redux/directUsActions';
import { RootState } from '@redux/reducers';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Content } from '.';
import { Sidebar } from './Sidebar';


export type ContentData = {
    id: number;
    imgSrc: string;
    title: string;
    author: string;
    desc: string;
    imageAWSs3: string;
};

const ContentWrap: React.FC = () => {
    const dispatch = useDispatch();
    const contentData = useSelector((state: RootState) => state.directUs.contentData)
    const sidebarData = useSelector((state: RootState) => state.directUs.sideBarData);
    const status = useSelector((state: RootState) => state.directUs.status)
    const [isOpen, setIsOpen] = useState(false);
    const [currentSidebarData, setSidebarData] = useState(sidebarData);

    useEffect(() => {
        // Fetch the data from an API or receive it as props
        // For demonstration purposes, I'm using hardcoded data:
        dispatch(fetchContentData())
        if (status === 'loading') {
            document.body.classList.add('js', 'loading');
        } else {
            document.body.classList.remove('js', 'loading');
        }
        
    }, [dispatch]);

    useEffect(() => {
        if (sidebarData) {
            setSidebarData(sidebarData);
        }
    }, [sidebarData]);

    const handleDiscoverClick = (contentType: any) => {
        // so item.id = {}
        // instead we could use from the store.
        // fetch the content from the API
        dispatch(fetchSidebarData(contentType.id))
        setIsOpen(true);  // Open the sidebar when the Discover button is clicked
    };

    const sortedContentData = React.useMemo(() => {
        return [...contentData].sort((a, b) => a.id - b.id);
    }, [contentData]);

    const handleSidebarClose = () => {
        setIsOpen(false); // Close the sidebar when outside is clicked
    };

    return (
        <>
           {sortedContentData.map((item: any, index) => (
                <Content onDiscoverClick={() => handleDiscoverClick(item)} key={index} {...item} />
            ))}
            {isOpen && sidebarData && (
                <Sidebar isOpen={isOpen} 
                onClose={handleSidebarClose} 
                title={sidebarData.title} 
                subtitle={sidebarData.subTitle} 
                paragraph={sidebarData.paragraph}
                content={sidebarData.content}
                status={status}/>
            )}
            
        </>
    );
};

export default ContentWrap;
