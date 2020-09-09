/**
 * HtmlTable( id, className ) - Creates and manages tables using HTML table element.
 * Bootstrap should be included in the document as it uses bootstrap styles internally.
 * If the usage of Boostrap is not allowed, then the styles for the table should be manually implemented.
 * The 'table' property in the HtmlTable instance holds the created table
 * @constructor
 * @param {String} id - The id that should be assigned for the created table
 * @param {String} className - The class name for the table
 * @returns {Object} - Returns an instance of HtmlTable
 * @author Hari
 * @example <caption>Example usage for HTMLTable</caption>
 * 
 * //Creating an instance
 * var htmlTable = new HtmlTable( 'test__table' );
 * document.body.appendChild( htmlTable.table );
 * 
 * //Setting the table headings from an array
 * htmlTable.setHeadersFromArray( [ 'First Name', 'Last Name', 'Address', 'Phone' ] );
 * 
 * //Creating a new table row
 * var htmlTableValueRow = document.createElement( 'tr' );
 * //Event listener for mouse click on the row
 * htmlTableValueRow.addEventListener( 'click', function( event ){ //Tasks to perform on clicking the row } );
 * 
 * var fNameClmn = document.createElement( 'td' );
 * fNameClmn.innerHTML = "User";
 * htmlTableValueRow.appendChild( fNameClmn );
 * 
 * var lNameClmn = document.createElement( 'td' );
 * lNameClmn.innerHTML = "1";
 * htmlTableValueRow.appendChild( lNameClmn );
 * 
 * var addrClmn = document.createElement( 'td' );
 * addrClmn.innerHTML = "Test Address";
 * htmlTableValueRow.appendChild( addrClmn );
 * 
 * var mobClmn = document.createElement( 'td' );
 * mobClmn.innerHTML = "1234567890";
 * htmlTableValueRow.appendChild( mobClmn );
 * 
 * //Attaching the created row to the table
 * htmlTable.addRow( htmlTableValueRow );
 * 
 * //The following table will be the result
 *  -----------------------------------------------------
 * | FIRST NAME | LAST NAME | ADDRESS      | PHONE       |
 *  -----------------------------------------------------
 * | User       | 1         | Test Address | 1234567890  |
 *  -----------------------------------------------------
 */
var HtmlTable = function( id, className ){

    var scope = this;

    this.table;
    this.tableHeader;
    this.tableHeaderRow;
    this.tableBody;
    
    var htmlTable = document.createElement( 'table' );
    htmlTable.setAttribute( 'id', id );

    if( className === undefined ){

        htmlTable.setAttribute( 'class', 'table table-striped table-hover' );

    }
    else{

        htmlTable.setAttribute( 'class', className );

    }

    var htmlTableHeader = document.createElement( 'thead' );

    var htmlTableHeaderRow = document.createElement( 'tr' );

    //Attaching the table header row to the thead section
    htmlTableHeader.appendChild( htmlTableHeaderRow );

    //Attaching the 'thead' section to the table
    htmlTable.appendChild( htmlTableHeader );

    //Creating a table body
    var htmlTableBody = document.createElement( 'tbody' );

    //Attaching the tbody section to the table
    htmlTable.appendChild( htmlTableBody );
    
    this.table = htmlTable;
    this.tableHeader = htmlTableHeader;
    this.tableHeaderRow = htmlTableHeaderRow;
    //this.tableBody = null;
    this.tableBody = htmlTableBody;

    return this;

}

HtmlTable.prototype = {

    constructor : HtmlTable,

    /**
     * show() - Makes the table visible
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of show()</caption>
     * var htmlTable = new HtmlTable( 'test__table' );
     * htmlTable.show();
     */
    show : function(){

        this.table.style.display = "block";

    },

    /**
     * hide() - Makes the table invisible
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of hide()</caption>
     * var htmlTable = new HtmlTable( 'test__table' );
     * htmlTable.hide();
     */
    hide : function(){

        this.table.style.display = "none";

    },

    /**
     * setClass() - Set the class name for the table
     * @param {String} classNames - The class name to set for the table
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setClass()</caption>
     * var htmlTable = new HtmlTable( 'test__table' );
     * htmlTable.setClass( 'table table-striped table-hover' );
     */
    setClass : function( classNames ){

        this.table.setAttribute( 'class', className );

    },

    /**
     * appendClass() - Appends the specified class name to the existing class names.
     * The difference between setClass() and appendClass() is that the former replaces the entire class name with the class name specified,
     * While the later attaches the specified class name to the end of the existing one
     * @param {String} className - The class name to append
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of appendClass()</caption>
     * //Class name before executing the code "table table-striped"
     * var htmlTable = new HtmlTable( 'test__table' );
     * htmlTable.appendClass( 'table-hover' );
     * //The class name of the table after executing the code "table table-striped table-hover"
     */
    appendClass : function( className ){

        this.table.className += " " + className;

    },

    /**
     * setHeaders( headings ) - Sets the specified heading to the table
     * @param {Object} headings - The heading to set for the table. 
     * This method expects an instance of HTMLTableSectionElement as the parameter
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setHeaders()</caption>
     * 
     * //Creating a thead section
     * var htmlTableHeader = document.createElement( 'thead' );
     * 
     * //Creating a row
     * var htmlTableHeaderRow = document.createElement( 'tr' );
     * 
     * //Creating a table heading
     * var tHeading = document.createElement( 'th' );
     * tHeading.innerHTML = "Heading 1";
     * 
     * //Attaching the heading to the row
     * htmlTableHeaderRow.appendChild( tHeading );
     * 
     * //Attaching the table header row to the thead section
     * htmlTableHeader.appendChild( htmlTableHeaderRow );
     * 
     * //Creating a table
     * var htmlTable = new HtmlTable( 'test__table' );
     * 
     * //Setting the heading for the table
     * htmlTable.setHeaders( htmlTableHeader );
     */
    setHeaders : function( headings ){

        if( headings != undefined && headings instanceof HTMLTableSectionElement ){

            try{

                if( this.tableHeader && this.tableHeader instanceof HTMLTableSectionElement ){

                    var parent = this.tableHeader.parentNode;
                    if( parent ){

                        parent.removeChild( this.tableHeader );
                        this.tableHeader = headings;
                        this.table.appendChild( this.tableHeader );
                    
                    }

                }
                else if( this.tableHeader === null ){

                    this.tableHeader = headings;
                    this.table.appendChild( this.tableHeader );

                }

            }
            catch( error ){
                console.warn( "%cHtmlTable.setHeaders( headings ) : " + error, "background-color:blue; color: yellow; font-style: italic; padding: 2px" );
            }

        }
        else{

            console.warn( "%cHtmlTable.setHeaders( headings ) : Function expects a parameter which is a thead element.", "background-color:blue; color: yellow; font-style: italic; padding: 2px" );

        }

    },

    /**
     * setHeadersFromArray( headings ) - Sets heading for the table using the array values specified
     * @param {Array} headings - An array of strings specifying the heading values
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setHeadersFromArray()</caption>
     * 
     * //The array specifying the heading values
     * var headings = [ 'Heading1', 'Heading2' ];
     * 
     * //Creating a table
     * var htmlTable = new HtmlTable( 'test__table' );
     * 
     * //Setting the heading for the table
     * htmlTable.setHeadersFromArray( headings );
     */
    setHeadersFromArray : function( headings ){

        if( headings != undefined && headings instanceof Array ){

            try{

                if( this.tableHeaderRow && this.tableHeaderRow instanceof HTMLTableRowElement ){

                    var parent = this.tableHeaderRow.parentNode;
                    if( parent ){
                        
                        parent.removeChild( this.tableHeaderRow );
                        this.tableHeaderRow = document.createElement( 'tr' );
                        this.tableHeader.appendChild( this.tableHeaderRow );

                    }

                }
                else if( this.tableHeaderRow === null ){
                    
                    this.tableHeaderRow = document.createElement( 'tr' );
                    this.tableHeader.appendChild( this.tableHeaderRow );

                }

                var len = headings.length;
                for( var i = 0; i < len; i++ ){

                    var textUpper = headings[ i ].toUpperCase();
                    var tHeading = document.createElement( 'th' );
                    tHeading.innerHTML = textUpper;
                    this.tableHeaderRow.appendChild( tHeading );

                }

            }
            catch( error ){
                console.warn( "%cHtmlTable.setHeadersFromArray( headings[] ) : " + error, "background-color:blue; color: yellow; font-style: italic; padding: 2px" );
            }

        }
        else{

            console.warn( "%cHtmlTable.setHeadersFromArray( headings[] ) : Function expects a parameter which is an array of strings.\nGive the headings as array of strings.\nExample : setHeaders( [ 'Name', 'Age' ] )", "background-color:blue; color: yellow; font-style: italic; padding: 2px" );

        }

    },

    /**
     * setBody( tableBody ) - Set the body for the table
     * @param {Object} tableBody - The table body to attach.
     * It should be an instance of HTMLTableSectionElement which represents the table body.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of setBody()</caption>
     * 
     * //Creating a table body
     * var htmlTableBody = document.createElement( 'tbody' );
     * 
     * //Creating a table
     * var htmlTable = new HtmlTable( 'test__table' );
     * 
     * //Attaching the tbody section to the table
     * htmlTable.setBody( htmlTableBody );
     */
    setBody : function( tableBody ){

        try{

            if( tableBody != undefined && tableBody instanceof HTMLTableSectionElement ){

                if( this.tableBody != null && this.tableBody instanceof HTMLTableSectionElement ){

                    var parent = this.tableBody.parentNode;
                    if( parent ){
                        
                        parent.removeChild( this.tableBody );
                        this.tableBody = tableBody;
                        this.table.appendChild( this.tableBody );

                    }

                }
                else if( this.tableBody === null ){

                    this.tableBody = tableBody;
                    this.table.appendChild( this.tableBody );

                }

            }
            else{

                console.warn( "%cHtmlTable.setBody( tableBody ) : Function expects a parameter which is a \"tbody\" element.", "background-color:blue; color: yellow; font-style: italic; padding: 2px" );

            }

        }
        catch( error ){
            console.warn( "%cHtmlTable.setBody( tableBody ) : " + error, "background-color:blue; color: yellow; font-style: italic; padding: 2px" );
        }

    },

    /**
     * addRow( tableBody ) - Method to dynamically attach a table row
     * @param {Object} row - The table row to add.
     * It should be an instance of HTMLTableRowElement which represents a table row.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of addRow()</caption>
     * 
     * //Creating an instance
     * var htmlTable = new HtmlTable( 'test__table' );
     * document.body.appendChild( htmlTable.table );
     * 
     * //Setting the table headings from an array
     * htmlTable.setHeadersFromArray( [ 'Name', 'Address', 'Phone' ] );
     * 
     * //Creating a new table row
     * var htmlTableValueRow = document.createElement( 'tr' );
     * //Event listener for mouse click on the row
     * htmlTableValueRow.addEventListener( 'click', function( event ){ //Tasks to perform on clicking the row } );
     * 
     * var nameClmn = document.createElement( 'td' );
     * nameClmn.innerHTML = "User";
     * htmlTableValueRow.appendChild( nameClmn );
     * 
     * var addrClmn = document.createElement( 'td' );
     * addrClmn.innerHTML = "Test Address";
     * htmlTableValueRow.appendChild( addrClmn );
     * 
     * var mobClmn = document.createElement( 'td' );
     * mobClmn.innerHTML = "1234567890";
     * htmlTableValueRow.appendChild( mobClmn );
     * 
     * //Attaching the created row to the table
     * htmlTable.addRow( htmlTableValueRow );
     * 
     * //The following table will be the result
     *  -----------------------------------------
     * | FIRST NAME | ADDRESS      | PHONE       |
     *  -----------------------------------------
     * | User       | Test Address | 1234567890  |
     *  -----------------------------------------
     */
    addRow : function( row ){

        if( row instanceof HTMLTableRowElement ){

            try{
                this.tableBody.appendChild( row );
            }
            catch( error ){
                console.warn( "%cHtmlTable.addRow( row ) : " + error, "background-color:blue; color: yellow; font-style: italic; padding: 2px" );
            }

        }
        else{

            console.warn( "%cHtmlTable.addRow( row ) : Function expects a parameter which is a tr element.", "background-color:blue; color: yellow; font-style: italic; padding: 2px" );

        }

    },

    /**
     * removeRow( row ) - Removes the specified row from the table.
     * @param {Object} row - The row that should be removed from the table.
     * It should be an instance of HTMLTableRowElement which represents a table row.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of removeRow()</caption>
     * 
     * var htmlTable = new HtmlTable( 'test__table' );
     * .
     * .
     * .
     * //To remove a row with id 'row-to-remove'
     * var row = document.getElementById( 'row-to-remove' );
     * htmlTable.removeRow( row );
     */
    removeRow : function( row ){

        if( row instanceof HTMLTableRowElement ){

            try{
                this.tableBody.deleteRow( row.rowIndex - 1 );
            }
            catch( error ){
                console.warn( "%cHtmlTable.removeRow( row ) : " + error, "background-color:blue; color: yellow; font-style: italic; padding: 2px" );
            }

        }
        else{

            console.warn( "%cHtmlTable.removeRow( row ) : Function expects a parameter which is a tr element.", "background-color:blue; color: yellow; font-style: italic; padding: 2px" );

        }

    },

    /**
     * editColumn( row, columnHeading, columnValue ) - Method to edit a column value on a specified row.
     * The advantage is that, the column can be specified with the row and it's corresponding table heading.
     * @param {Object} row - The row in which the column resides.
     * It should be an instance of HTMLTableRowElement which represents a table row.
     * @param {String} columnHeading - The corresponding heading for the column.
     * @param {String} columnValue - The value that should be given for the specified column.
     * @returns {Void}
     * @author Hari
     * @example <caption>Example usage of editColumn()</caption>
     * 
     *  ----------------------------------------
     * | FIRST NAME | ADDRESS      | PHONE      |
     *  ----------------------------------------
     * | User       | Test Address | 1234567890 |
     *  ----------------------------------------
     * | User2      | Address 2    | 9999999999 |
     *  ----------------------------------------
     * 
     * //Get the target row
     * var targetRow = document.getElementById( 'html-table-second-row' );
     * 
     * //Let htmlTable is the table constructor
     * //To edit the address( second column ) in the second row( with row id 'html-table-second-row' ), perform,
     * htmlTable.editColumn( targetRow, 'ADDRESS', 'sample user address' );
     * 
     * //Resulting table,
     *  -----------------------------------------------
     * | FIRST NAME | ADDRESS             | PHONE      |
     *  -----------------------------------------------
     * | User       | Test Address        | 1234567890 |
     *  -----------------------------------------------
     * | User2      | sample user address | 9999999999 |
     *  -----------------------------------------------
     */
    editColumn : function( row, columnHeading, columnValue ){

        if( columnHeading && row && columnValue ){

            if( row instanceof HTMLTableRowElement ){

                try{

                    var headings = this.table.rows[ 0 ].cells;
                    var headingsLen = headings.length, columnHeadingIndex;
                    columnHeading = columnHeading.toLowerCase();
                    for( var i = 0; i < headingsLen; i++ ){

                        if( ( headings[ i ].innerHTML ).toLowerCase() === columnHeading ){

                            columnHeadingIndex = i;
                            break;

                        }

                    }
                    row.cells[ columnHeadingIndex ].innerHTML = columnValue;

                }
                catch( error ){

                    console.warn( "%cHtmlTable.editColumn( row, columnHeading ) : " + error, "background-color:blue; color: yellow; font-style: italic; padding: 2px" );
                    return;

                }

            }
            else{

                console.warn( "%cHtmlTable.editColumn( row, columnHeading ) : Function expects a \"row\" parameter which is a tr element.", "background-color:blue; color: yellow; font-style: italic; padding: 2px" );

            }

        }
        else{

            console.warn( "%cHtmlTable.editColumn( row, columnHeading ) : Function expects \"row\", \"columnHeading\" and \"columnValue\" parameters.", "background-color:blue; color: yellow; font-style: italic; padding: 2px" );

        }

    },

}