import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import gantt from 'dhtmlx-gantt';
import api from '../../../constants/api';

const Gantt = ({projectId}) => {
    const [projects, setProjects] = useState([]);

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return duration;
    };

    const fetchData = () => {
        api.post('/milestone/getMilestoneProjectById',{project_id:projectId})
            .then(response => {
                console.log('API Response:', response.data);

                if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
                    const projectData = response.data.data;
                    console.log('Project Data:', projectData);

                    // Convert projectData into Gantt chart format
                    const ganttData = projectData.map(project => ({
                        id: project.project_milestone_id,
                        text: project.milestone_title,
                        start_date: new Date(project.from_date).toLocaleDateString('en-GB'), // Adjust date format if necessary
                        duration: calculateDuration(project.from_date, project.to_date),
                        progress: project.per_completed / 100,
                    }));

                    gantt.clearAll(); // Clear previous data
                    gantt.parse({ data: ganttData });
                    setProjects(projectData);
                } else {
                    console.log('No data available.');
                    setProjects([]);
                    gantt.clearAll(); // Clear previous data
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                console.log('No data available.');
                setProjects([]);
                gantt.clearAll(); // Clear previous data
            });
    };

    useEffect(() => {
        gantt.init('gantt_here');
        gantt.config.readonly = true; // Make Gantt chart read-only
        gantt.config.buttons_left = []; // Remove the + button

        const ganttData = projects.map(project => ({
            id: project.project_milestone_id,
            text: project.milestone_title,
            start_date: new Date(project.from_date).toLocaleDateString('en-GB'), // Adjust date format if necessary
            duration: calculateDuration(project.from_date, project.to_date),
            progress: project.per_completed / 100,
        }));
        gantt.parse({ data: ganttData });

        return () => {
            gantt.clearAll(); // Clear Gantt chart data when component unmounts
        };
    }, [projects]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h1 style={{ color: 'green', textAlign: 'center' }}>Project Gantt Chart</h1>
            <div id="gantt_here" style={{ width: '90%', height: '600px', margin: 'auto' }}></div>
        </div>
    );
};
Gantt.propTypes = {
    
    projectId: PropTypes.any
    
  };
export default Gantt;
