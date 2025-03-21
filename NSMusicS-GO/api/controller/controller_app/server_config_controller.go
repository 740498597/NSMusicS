package controller_app

import (
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AppServerConfigController struct {
	usecase domain_app.AppServerConfigUsecase
}

func NewAppServerConfigController(uc domain_app.AppServerConfigUsecase) *AppServerConfigController {
	return &AppServerConfigController{usecase: uc}
}

func (ctrl *AppServerConfigController) Update(c *gin.Context) {
	var req domain_app.AppServerConfig
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request format"})
		return
	}

	if req.ID.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "requires non-empty id"})
		return
	}

	if err := ctrl.usecase.Update(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "app config updated"})
}

func (ctrl *AppServerConfigController) GetAll(c *gin.Context) {
	configs, err := ctrl.usecase.GetAll(c.Request.Context())
	if err != nil {
		if errors.Is(err, domain.ErrEmptyCollection) {
			c.JSON(http.StatusOK, []interface{}{})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
		return
	}
	c.JSON(http.StatusOK, configs)
}
