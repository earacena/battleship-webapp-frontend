import React from 'react';

type TitleHeaderProps = {
  title: string,
};

function TitleHeader({ title }: TitleHeaderProps) {
  return (
    <h1 style={{ display: 'flex', fontSize: '50px',justifyContent: 'center' }}>
      {title}
    </h1>
  );
}

export default TitleHeader;
