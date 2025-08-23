import React from 'react';
import Layout from '../components/Layout';
import LeadForm from '../components/LeadForm';

const EditLead = () => {
  return (
    <Layout>
      <LeadForm isEdit={true} />
    </Layout>
  );
};

export default EditLead;