﻿class PeriodicTableDisplay
{
	constructor(periodictable, tableid, infoboxbackgroundid, infoboxid)
	{
		this._periodictable = periodictable;
        this._tableid = tableid;

		this._periodictable.AddFilterChangedEventHandler(this._onFilterChanged);

		this._infobox = new PeriodicTableInfoBox(periodictable, infoboxbackgroundid, infoboxid);

		this._categoryClassMappings =
		{
			"Alkali metal": "alkalimetal",
			"Toprak alkali metal": "alkalineearthmetal",
			"Lantanit": "lanthanide",
			"Aktinit": "actinide",
			"Geçiş metali": "transitionmetal",
			"Zayıf metal": "posttransitionmetal",
			"Yarı metal": "metalloid",
			"Reaktif ametal": "reactivenonmetal",
			"Soygaz": "noblegas",
			"Bilinmiyor": "unknown"
		}

		this._blockClassMappings =
		{
			"s": "sblock",
			"d": "dblock",
			"f": "fblock",
			"p": "pblock"
		}

		this._groupNames =
		{
			1: "Alkali metaller",
			2: "Toprak alkali metaller ",
			15: "Azot Grubu",
			16: "Kalkojenler",
			17: "Halojenler",
			18: "Soygazlar"
		};

		this._createCells();
		this._createColumnHeadings();
		this._createRowHeadings();
		this._populate();

		document.getElementById(this._tableid).addEventListener('click', event =>
		{
			let target = event.target;

			if(target.parentElement.classList.contains("elementcell"))
			{
				target = event.target.parentElement;
			}

			if(target.classList.contains("elementcell"))
			{
				this._infobox.Show(target.dataset.atomicnumber);
			}
		});
    }


	_onFilterChanged(changed)
	{
		let currentcell = null;

		for(let element of changed)
		{
			currentcell = document.querySelector(`[data-row='${element.tablerow18col}'][data-column='${element.tablecolumn18col}']`);

			currentcell.classList.toggle("elementcellfaded");
		}
	}


	_createCells()
	{
		let table = document.getElementById(this._tableid);

		let currentcell;

		for(let row = 0; row < this._periodictable.rowcount; row++)
		{
            let newrow = document.createElement('tr');
			table.appendChild(newrow);

			for(let column = 0; column < this._periodictable.columncount; column++)
			{
                let cell = document.createElement('td');

				cell.setAttribute("data-row", row);
				cell.setAttribute("data-column", column);

                newrow.appendChild(cell);

				currentcell = document.querySelector(`[data-row='${row}'][data-column='${column}']`);
				currentcell.classList.add("cell");
			}
		}
	}


	_createColumnHeadings()
	{
		for(let column = 1; column <= 18; column++)
		{
			let currentcell = document.querySelector(`[data-row='0'][data-column='${column}']`);
			currentcell.innerHTML = `${column}<br /><span class="groupname">${this._groupNames[column] || "&nbsp;"}</span>`;
			currentcell.classList.add("headingcell");
		}
	}


	_createRowHeadings()
	{
		for(let row = 1; row <= 7; row++)
		{
			let currentcell = document.querySelector(`[data-row='${row}'][data-column='0']`);
			currentcell.innerHTML = row;
			currentcell.classList.add("headingcell");
		}
	}


    _populate()
    {
		let currentcell = null;
		let tooltip = "";

		for(let element of this._periodictable.data)
		{
			currentcell = document.querySelector(`[data-row='${element.tablerow18col}'][data-column='${element.tablecolumn18col}']`);

			currentcell.setAttribute('data-atomicnumber', element.atomicnumber);

			currentcell.innerHTML = `
				${element.name}<br />
				${element.atomicnumber}<br />
				<span class="chemicalsymbol">${element.symbol}</span><br />
				${element.atomicweight}`;

			tooltip = `İsim: ${element.name}
					Atom Numarası: ${element.atomicnumber}
					Kimyasal Sembol: ${element.symbol}
					Kategori: ${element.category}
					Atom Kütlesi - Konvensiyonel: ${element.atomicweight}
					Atom Kütlesi - Standart: ${element.atomicweightfull}
					Hali: ${element.occurrence}
					Madde Durumu: ${element.stateofmatter}
					Grup Numarası: ${element.group}
					Periyot Numarası: ${element.period}
					Blok: ${element.block}`;

			currentcell.setAttribute("title", tooltip.replace(/\t/g, ''));

			currentcell.classList.add("elementcell");
		}

		this.ColorByCategory();
		// this.ColorByBlock();
    }


	ColorByCategory()
	{
        for(let element of this._periodictable.data)
		{
			let currentcell = document.querySelector(`[data-row='${element.tablerow18col}'][data-column='${element.tablecolumn18col}']`);

			for(let v of Object.values(this._blockClassMappings))
			{
				currentcell.classList.remove(v);
			}

			currentcell.classList.add(this._categoryClassMappings[element.category]);
		}
	}


	ColorByBlock()
	{
        for(let element of this._periodictable.data)
		{
			let currentcell = document.querySelector(`[data-row='${element.tablerow18col}'][data-column='${element.tablecolumn18col}']`);

			for(let v of Object.values(this._categoryClassMappings))
			{
				currentcell.classList.remove(v);
			}

			currentcell.classList.add(this._blockClassMappings[element.block]);
		}
	}
}
