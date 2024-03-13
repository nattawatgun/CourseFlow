import { Center, Text } from '@mantine/core';

function AssignmentStatus({ children }) {
  let statusStyle = { borderRadius: '4px' };
  switch (children) {
  case 'In Progress':
    statusStyle = { ...statusStyle, background: '#DDF9EF', color: '#0A7B60' };
    break;
  case 'Overdue':
    statusStyle = { ...statusStyle, background: '#FAE7F4', color: '#9B2FAC' };
    break;
  case 'Pending':
    statusStyle = { ...statusStyle, background: '#FFFBDB', color: '#996500' };
    break;
  case 'Submitted':
    statusStyle = { ...statusStyle, background: '#DDF9EF', color: '#0A7B60' };
    break;
  default:
    statusStyle = { ...statusStyle, background: '#D6D9E4', color: '#9AA1B9' };
    break;
  }
  return (
    <Center style={statusStyle}>
      <Text style={{ padding: '4px 8px', margin: 0, lineHeight: '150%' }}>{children}</Text>
    </Center>
  );
}

export default AssignmentStatus;