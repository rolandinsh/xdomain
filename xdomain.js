/*
	xdomain.js : Automatically tracks a visitor across domains in Google 
	Analytics, automatically tracks their downloads, and clicks on 
	outbound links.
	
    Copyright (C) 2012  LunaMetrics

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($) {

function listenToClicks()
{
	var domains=["domain1.com", "domain2.com"];
	var fileTypes=[".doc", ".xls", ".exe", ".zip", ".pdf", ".mov", ".mp3"];

	$('a[href]').each(function(index) {
 		var link = $(this);
		var href = link.attr('href');
		
		$.each(fileTypes, function(i) {
			if($(link).attr('href').indexOf(this)!=-1){
				valid = false;
				$(link).bind('click', function(c) {
					c.preventDefault();
	                _gat._getTrackerByName()._trackEvent('Download', 'Click - ' + $(link).attr('href'));
	                setTimeout('document.location = "' + $(link).attr('href') + '"', 100);
	            });
			}
		});

		var valid = false;
		$.each(domains, function(j) {
				if(($(link).attr('href').indexOf(this)!=-1)&&(window.location.href.indexOf(this)==-1)){	
					valid = true;

					if (valid)
					{
						$(link).bind('click', function(l) {
							if(typeof(_gat)=="object"){
								l.preventDefault();
								if ($(link).attr('target') != "_blank")
								{
									_gaq.push(['_link',$(link).attr('href')]);
								}
						 		else
						 		{
				 					var tracker = _gat._getTrackerByName();
									var fullUrl = tracker._getLinkerUrl($(link).attr('href'));
									window.open(fullUrl);
						 		}
							}
						});
					}
				}			
		});

		var rootDomain = document.domain.split(".")[document.domain.split(".").length - 2] + "." + document.domain.split(".")[document.domain.split(".").length - 1];

		if ( (href.match(/^http/)) && (href.indexOf(rootDomain) == -1) && !valid) {
			$(link).bind('click', function(d) {
					d.preventDefault();
			      	_gat._getTrackerByName()._trackEvent('Outbound Link', href);
			    	setTimeout('document.location = "' + href + '"', 100);
			    });			   
		}
	});
	
}

$(document).ready(function() {
	listenToClicks();
});

})(jQuery);