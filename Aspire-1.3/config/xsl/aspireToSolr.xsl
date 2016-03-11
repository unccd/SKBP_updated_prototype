<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>
  <xsl:preserve-space elements="value"/>
  
  <!-- XSLT convert Aspire Document to Solr XML -->
  <xsl:template match="/doc">
    <add overwrite="true">
      <doc>
        <xsl:for-each select="solr/*">
          <xsl:if test = '. != ""'>
            <field>
              <xsl:attribute name="name"><xsl:value-of select="local-name()"/></xsl:attribute>
              <xsl:value-of select="'&lt;![CDATA['" disable-output-escaping="yes"/>
              <xsl:value-of select="."/>
              <xsl:value-of select="']]&gt;'" disable-output-escaping="yes"/>
            </field>
          </xsl:if>
        </xsl:for-each>
      </doc>
    </add>
  </xsl:template>
</xsl:stylesheet> 