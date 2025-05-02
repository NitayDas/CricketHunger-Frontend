import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Card from '../Card/Card';
import './tabs.css'

const MatchesContainer = ({cards}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedSubTab, setSelectedSubTab] = useState(0);

    const filterCards = (cards, match_type, state) => {
        let filtered = cards;
        if (match_type === 'Domestic') {
            filtered = filtered.filter(card => card.match_type === 'Domestic');
        } else if (match_type === 'International') {
            filtered = filtered.filter(card => card.match_type === 'International');
        }else{
            filtered = filtered.filter(card => card.match_type === 'League');
        }

        if (state !== 'Complete' && state !=='Upcoming') {
            filtered = filtered.filter(card => card.state !== 'Complete' && card.state !== 'Upcoming');
        } else if (state === 'Complete') {
            filtered = filtered.filter(card => card.state === 'Complete');
        } else if (state === 'Upcoming') {
            filtered = filtered.filter(card => card.state === 'Upcoming');
        }
        return filtered;
    };

    const filteredCards = () => {
        let filtered = cards;
        if (selectedTab === 0) {
            filtered = filterCards(filtered, 'Domestic', ['In Progress', 'Complete', 'Upcoming'][selectedSubTab]);
        } else if (selectedTab === 1) {
            filtered = filterCards(filtered, 'International', ['In Progress', 'Complete', 'Upcoming'][selectedSubTab]);
        } else {
            filtered = filterCards(filtered, 'League', ['In Progress', 'Complete', 'Upcoming'][selectedSubTab]);
        }
        return filtered;
    };

    return (
        <div className='w-full my-16 p-5 gap-5 mx-auto bg-white rounded-2xl lg:w-11/12 ' >
            <h2 className='text-2xl font-semibold pb-5'>Matches</h2>
            <Tabs  selectedIndex={selectedTab} onSelect={index => setSelectedTab(index)}>
                <TabList>
                    <Tab >Domestic</Tab>
                    <Tab >International</Tab>
                    <Tab>League</Tab>
                </TabList>
                <TabPanel>
                    <Tabs selectedIndex={selectedSubTab} onSelect={index => setSelectedSubTab(index)}>
                        <TabList >
                            <Tab>Live</Tab>
                            <Tab>Recent</Tab>
                            <Tab>Upcoming</Tab>
                        </TabList>
                        <TabPanel>
                           <div className='flex justify-center'>
                           <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8' >
                            {/* <TabList>                            <Tab>Live</Tab>
                            <Tab>Recent</Tab>
                            <Tab>Upcoming</Tab>
                        </TabList> */}
                                {filteredCards().map(card => (
                                    <Card key={card.id} card={card} />
                                ))}
                            </div>
                           </div>
                        </TabPanel>
                        <TabPanel>
                        <div className='flex justify-center'>
                        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8'>
                            {/* <TabList>
                            <Tab>Live</Tab>
                            <Tab>Recent</Tab>
                            <Tab>Upcoming</Tab>
                        </TabList> */}
                                {filteredCards().map(card => (
                                    <Card key={card.id} card={card} />
                                ))}
                            </div>
                        </div>
                        </TabPanel>
                        <TabPanel>
                           <div className='flex justify-center'>
                           <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8'>
                            {/* <TabList>
                            <Tab>Live</Tab>
                            <Tab>Recent</Tab>
                            <Tab>Upcoming</Tab>
                        </TabList> */}
                                {filteredCards().map(card => (
                                    <Card key={card.id} card={card} />
                                ))}
                            </div>
                           </div>
                        </TabPanel>
                    </Tabs>
                </TabPanel>
                <TabPanel>
                    <Tabs selectedIndex={selectedSubTab} onSelect={index => setSelectedSubTab(index)}>
                        <TabList>
                            <Tab>Live</Tab>
                            <Tab>Recent</Tab>
                            <Tab>Upcoming</Tab>
                        </TabList>
                        <TabPanel>
                          <div className='flex justify-center'>
                          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8'>
                                {filteredCards().map(card => (
                                    <Card key={card.id} card={card} />
                                ))}
                            </div>
                          </div>
                        </TabPanel>
                        <TabPanel>
                        <div className='flex justify-center'>
                        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8'>
                                {filteredCards().map(card => (
                                    <Card key={card.id} card={card} />
                                ))}
                            </div>
                        </div>
                        </TabPanel>
                        <TabPanel>
                          <div className='flex justify-center'>
                          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8 '>
                                {filteredCards().map(card => (
                                    <Card key={card.id} card={card} />
                                ))}
                            </div>
                          </div>
                        </TabPanel>
                    </Tabs>
                </TabPanel>

              {/* League */}
                <TabPanel>
                    <Tabs selectedIndex={selectedSubTab} onSelect={index => setSelectedSubTab(index)}>
                        <TabList>
                            <Tab>Live</Tab>
                            <Tab>Recent</Tab>
                            <Tab>Upcoming</Tab>
                        </TabList>
                        <TabPanel>
                           <div className='flex justify-center'>
                           <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8'>
                                {filteredCards().map(card => (
                                    <Card key={card.id} card={card} />
                                ))}
                            </div>
                           </div>
                        </TabPanel>
                        <TabPanel>
                         <div className='flex justify-center'>
                         <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8'>
                                {filteredCards().map(card => (
                                    <Card key={card.id} card={card} />
                                ))}
                            </div>
                         </div>
                        </TabPanel>
                        <TabPanel>
                         <div className='flex justify-center'>
                         <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-8'>
                                {filteredCards().map(card => (
                                    <Card key={card.id} card={card} />
                                ))}
                            </div>
                         </div>
                        </TabPanel>
                    </Tabs>
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default MatchesContainer;
