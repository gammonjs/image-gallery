import { Layout } from 'antd';
import React from 'react';
import GalleryViewModel from '../modules/view-models/Gallery';

const Home: React.FC = () => (
    <Layout style={{ height: '100vh', minHeight: '969px', padding: '5%' }}>
        <GalleryViewModel />
    </Layout>
);

export default Home;
